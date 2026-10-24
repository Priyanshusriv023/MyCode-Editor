
import { useState, useCallback, useRef } from "react";


interface AISuggestionsState {
    suggestion: string | null;
    isLoading: boolean;
    position: { line: number; column: number } | null;
    decoration: string[];
    isEnabled: boolean;
}

interface UseAISuggestionsReturn extends AISuggestionsState {
    toggleEnabled: () => void;
    fetchSuggestion: (type: string, editor: any) => Promise<void>;
    acceptSuggestion: (editor: any, monaco: any) => void;
    rejectSuggestion: (editor: any) => void;
    clearSuggestion: (editor: any) => void;
}

export const useAISuggestions = (): UseAISuggestionsReturn => {
    const requestControllerRef = useRef<AbortController | null>(null);
    const [state, setState] = useState<AISuggestionsState>({
        suggestion: null,
        isLoading: false,
        position: null,
        decoration: [],
        isEnabled: true,
    });

    const toggleEnabled = useCallback(() => {
        setState((prev) => ({ ...prev, isEnabled: !prev.isEnabled }))
    }, [])

    const fetchSuggestion = useCallback(async (type: string, editor: any) => {
        if (!state.isEnabled || !editor) return;

        const model = editor.getModel();
        const cursorPosition = editor.getPosition();
        if (!model || !cursorPosition) return;

        requestControllerRef.current?.abort();
        const controller = new AbortController();
        requestControllerRef.current = controller;
        setState((currentState) => ({ ...currentState, isLoading: true }));

        try {
            const response = await fetch("/api/code-completion", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                signal: controller.signal,
                body: JSON.stringify({
                    fileContent: model.getValue(),
                    cursorLine: cursorPosition.lineNumber - 1,
                    cursorColumn: cursorPosition.column - 1,
                    suggestionType: type
                })
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.error || `API responded with status ${response.status}`);
            }

            const suggestionText =
                typeof data.suggestion === "string" ? data.suggestion.trim() : "";
            if (requestControllerRef.current !== controller) return;
            setState((prev) => ({
                ...prev,
                suggestion: suggestionText || null,
                position: suggestionText
                    ? { line: cursorPosition.lineNumber, column: cursorPosition.column }
                    : null,
                isLoading: false
            }));
        } catch (error) {
            if (!(error instanceof DOMException && error.name === "AbortError")) {
                console.error("Error fetching code suggestion:", error);
            }
            if (requestControllerRef.current === controller) {
                setState((prev) => ({ ...prev, isLoading: false }));
            }
        }
    }, [state.isEnabled])


   const acceptSuggestion = useCallback((editor: any, monaco: any) => {
        setState((currentState) => {
            if (!currentState.suggestion || !currentState.position || !editor || !monaco) {
                return currentState;
            }

            const { line, column } = currentState.position;
            const sanitizedSuggestion = currentState.suggestion.replace(/^\d+:\s*/gm, "");

            editor.executeEdits("", [
                {
                    range: new monaco.Range(line, column, line, column),
                    text: sanitizedSuggestion,
                    forceMoveMarkers: true,
                },
            ]);

            if (currentState.decoration.length > 0) {
                editor.deltaDecorations(currentState.decoration, []);
            }

            return {
                ...currentState,
                suggestion: null,
                position: null,
                decoration: [],
            };
        });
    }, []);

    const rejectSuggestion = useCallback((editor:any)=>{
            setState((currentState)=>{
                 if(editor && currentState.decoration.length > 0){
                    editor.deltaDecorations(currentState.decoration , [])
                }

                return {
                    ...currentState,
                    suggestion:null,
                    position:null,
                    decoration:[]
                }
            })
    },[]);
 
    const clearSuggestion = useCallback((editor: any) => {
    setState((currentState) => {
      if (editor && currentState.decoration.length > 0) {
        editor.deltaDecorations(currentState.decoration, []);
      }
      return {
        ...currentState,
        suggestion: null,
        position: null,
        decoration: [],
      };
    });
  }, []);


  return {
    ...state,
    toggleEnabled,
    fetchSuggestion,
    acceptSuggestion,
    rejectSuggestion,
    clearSuggestion
  }

}