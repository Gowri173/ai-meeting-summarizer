import { useState } from "react";

function App() {
  const [transcript, setTranscript] = useState("");
  const [prompt, setPrompt] = useState("Summarize in bullet points highlighting key decisions and action items.");
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailTo, setEmailTo] = useState("");
  const [emailSubject, setEmailSubject] = useState("Meeting Summary");

  function handleFile(file) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setTranscript(reader.result);
    reader.readAsText(file);
  }

  async function generate() {
    setLoading(true);
    setSummary("");
    const res = await fetch("http://localhost:5000/api/summarize", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ transcript, prompt })
    });
    const data = await res.json();
    if (data.summary) setSummary(data.summary);
    setLoading(false);
  }

  async function sendEmail() {
    const res = await fetch("http://localhost:5000/api/email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ to: emailTo, subject: emailSubject, html: summary })
    });
    const data = await res.json();
    alert(data.ok ? "Email sent ✔" : data.error);
  }

  return (
    <div style={{ maxWidth: 720, margin: "auto", padding: 16, fontFamily: "Arial" }}>
      <h1>AI Meeting Summarizer</h1>

      <input type="file" accept=".txt" onChange={(e) => handleFile(e.target.files[0])} />
      <textarea value={transcript} onChange={(e) => setTranscript(e.target.value)} rows={6} style={{ width: "100%", marginTop: 8 }} placeholder="Paste transcript..."></textarea>

      <textarea value={prompt} onChange={(e) => setPrompt(e.target.value)} rows={3} style={{ width: "100%", marginTop: 8 }} placeholder="Enter summarization instruction..."></textarea>

      <button onClick={generate} disabled={loading}>{loading ? "Generating..." : "Generate Summary"}</button>

      <textarea value={summary} onChange={(e) => setSummary(e.target.value)} rows={10} style={{ width: "100%", marginTop: 8 }} placeholder="Editable summary..."></textarea>

      <input value={emailTo} onChange={(e) => setEmailTo(e.target.value)} style={{ width: "100%", marginTop: 8 }} placeholder="Recipient email(s)" />
      <input value={emailSubject} onChange={(e) => setEmailSubject(e.target.value)} style={{ width: "100%", marginTop: 8 }} placeholder="Subject" />

      <button onClick={sendEmail} disabled={!summary || !emailTo} style={{ marginTop: 8 }}>Send Email</button>
    </div>
  );
}

export default App;