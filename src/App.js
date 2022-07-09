import React from "react";
import Sidebar from "./components/Slidebar";
import Editor from "./components/Editor";
import { data } from "./data";
import Split from "react-split";
import { nanoid } from "nanoid";

/**
 * Challenge: When the user edits a note, reposition
 * it in the list of notes to the top of the list
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

    function deleteNote(event, noteId) {
        event.stopPropagation();
        setNotes((prevNotes) => {
            const newNotes = [];
            prevNotes.forEach((note) => {
                if (note.id != noteId) {
                    newNotes.push(note);
                }
            });
            console.log(newNotes);
            return newNotes;
        });
    }

    // toda vez que uma nota for editada armazena o novo texto na id especifica
    function updateNote(text) {
        setNotes((oldNotes) => {
            const newNotes = [];
            // passa por todas as notas existentes
            oldNotes.forEach((note) => {
                if (note.id === currentNoteId) {
                    // coloca nota mudada na primeira posição
                    newNotes.unshift({ ...note, body: text });
                } else {
                    newNotes.push(note);
                }
            });
            return newNotes;
        });
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
                        deleteNote={deleteNote}
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
