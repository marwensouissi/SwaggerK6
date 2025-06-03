import React, { useState } from "react"
import { uploadSwaggerJson } from "../../services/swaggerService"

const SwaggerUpload = ({ onSuccess }) => {
  const [error, setError] = useState(null)

  const handleFileDrop = async (e) => {
    e.preventDefault()
    setError(null)

    const file = e.dataTransfer?.files?.[0] || e.target?.files?.[0]
    if (!file || file.name !== "swagger.json") {
      setError("Please upload a valid swagger.json file.")
      return
    }

    try {
      await uploadSwaggerJson(file)
      onSuccess()
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleFileDrop}
      style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#090D2B",
        color: "#fff",
        flexDirection: "column",
        fontFamily: "'Segoe UI', sans-serif",
      }}
    >
      <h2>Drop your <code>swagger.json</code> here</h2>
      <input type="file" accept=".json" onChange={handleFileDrop} />
      {error && <p style={{ color: "#FF3B30", marginTop: "16px" }}>{error}</p>}
    </div>
  )
}

export default SwaggerUpload
