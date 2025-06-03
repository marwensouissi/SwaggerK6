export async function checkIfSwaggerExists() {
    const res = await fetch("http://localhost:6060/api/swagger/exists");
    const exists = await res.json(); // just `true` or `false`
    console.log("Swagger exists:", exists);
    return res.ok && exists;
  }
  
  
  
  export async function uploadSwaggerJson(file) {
    const formData = new FormData();
    formData.append("file", file);
  
    const res = await fetch("http://localhost:6060/api/swagger/upload", {
      method: "POST",
      body: formData,
    });
  
    if (!res.ok) throw new Error("Failed to upload swagger.json");
  }
  