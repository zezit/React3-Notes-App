import React from "react";
import Sidebar from "./components/Slidebar";
import Editor from "./components/Editor";
import { data } from "./data";
import Split from "react-split";
import { nanoid } from "nanoid";

/**
 * Challenge:
 * 1. Every time the `notes` array changes, save it
 *    in localStorage. You'll need to use JSON.stringify()
 *    to turn the array into a string to save in localStorage.
 * 2. When the app first loads, initialize the notes state
 *    with the notes saved in localStorage. You'll need to
 *    use JSON.parse() to turn the stringified array back
 *    into a real JS array.
 */

export default function App() {
    // state para todas as notas
    const [notes, setNotes] = React.useState(() => {
        return JSON.parse(localStorage.getItem("notes")) || [];
    });
    // state para mudar tela das notas
    const [currentNoteId, setCurrentNoteId] = React.useState(
        (notes[0] && notes[0].id) || ""
    );

    React.useEffect(() => {
        localStorage.setItem("notes", JSON.stringify(notes));
        console.log(notes);
    });

    // função para criar novas notas
    function createNewNote() {
        const newNote = {
            id: nanoid(), // coloca uma id única para cada nota
            body: "# Type your markdown note's title here",
        };
        // salva nas notas já existentes
        setNotes((prevNotes) => [newNote, ...prevNotes]);
        // muda a tela para a nova nota
        setCurrentNoteId(newNote.id);
    }

    // toda vez que uma nota for editada armazena o novo texto na id especifica
    function updateNote(text) {
        setNotes((oldNotes) =>
            oldNotes.map((oldNote) => {
                return oldNote.id === currentNoteId
                    ? { ...oldNote, body: text }
                    : oldNote;
            })
        );
    }

    // utilizada para trocar entres as notas existentes
    function findCurrentNote() {
        return (
            notes.find((note) => {
                return note.id === currentNoteId;
            }) || notes[0]
        );
    }

    return (
        <main>
            {notes.length > 0 ? (
                <Split
                    sizes={[30, 70]}
                    direction="horizontal"
                    className="split"
                >
                    <Sidebar
                        notes={notes}
                        currentNote={findCurrentNote()}
                        setCurrentNoteId={setCurrentNoteId}
                        newNote={createNewNote}
                    />
                    {currentNoteId && notes.length > 0 && (
                        <Editor
                            currentNote={findCurrentNote()}
                            updateNote={updateNote}
                        />
                    )}
                </Split>
            ) : (
                <div className="no-notes">
                    <h1>You have no notes</h1>
                    <button className="first-note" onClick={createNewNote}>
                        Create one now
                    </button>
                </div>
            )}
        </main>
    );
}
