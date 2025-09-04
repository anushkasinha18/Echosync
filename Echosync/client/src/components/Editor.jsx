import React, { useEffect, useRef } from "react";
import Editor from "@monaco-editor/react";

const CodeEditor = ({ value, onChange, language = "javascript", theme = "vs-dark", userName, roomId }) => {
  const editorRef = useRef(null);

  // Save editor instance
  function handleEditorDidMount(editor, monaco) {
    editorRef.current = editor;
  }

  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      {/* Header */}
      <header style={{
        background: "#0b0f14",
        color: "#fff",
        padding: "10px 20px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        fontSize: "14px",
        fontWeight: "500",
        borderBottom: "1px solid #1f2937"
      }}>
        <div>
          <strong>Echosync</strong> 🚀 | Room: <span style={{ color: "#3b82f6" }}>{roomId}</span>
        </div>
        <div>User: <span style={{ color: "#22c55e" }}>{userName}</span></div>
      </header>

      {/* Monaco Editor */}
      <Editor
        height="100%"
        defaultLanguage={language}
        value={value}
        theme={theme}
        onChange={onChange}
        onMount={handleEditorDidMount}
        options={{
          fontSize: 14,
          minimap: { enabled: true },
          fontFamily: "Fira Code, monospace",
          automaticLayout: true,
        }}
      />
    </div>
  );
};

export default CodeEditor;
