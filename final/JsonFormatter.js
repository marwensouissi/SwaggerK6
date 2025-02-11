const fs = require('fs');

const FILE_PATH = "device_credentials.json";

function fixJsonFile() {
    let fixedData = [];

    try {
        // ✅ Read the file
        let fileContent = fs.readFileSync(FILE_PATH, "utf8").trim();

        if (!fileContent) {
            console.warn("⚠️ JSON file is empty. Nothing to fix.");
            return;
        }

        // ✅ Extract all JSON blocks
        let jsonObjects = fileContent.match(/\[.*?\]/gs);

        if (!jsonObjects) {
            console.error("❌ No valid JSON objects found!");
            return;
        }

        // ✅ Merge all separate arrays into one
        jsonObjects.forEach(json => {
            try {
                let parsedArray = JSON.parse(json);
                if (Array.isArray(parsedArray)) {
                    fixedData = fixedData.concat(parsedArray);
                }
            } catch (error) {
                console.error("❌ Error parsing JSON block:", error);
            }
        });

        // ✅ Write the corrected JSON back to the file
        fs.writeFileSync(FILE_PATH, JSON.stringify(fixedData, null, 2));
        console.log("✅ JSON file has been fixed successfully!");

    } catch (error) {
        console.error("❌ Error reading or fixing JSON file:", error);
    }
}

// Run the fix function
fixJsonFile();
