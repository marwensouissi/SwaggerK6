import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { removeApiEntry } from '../plugins/oas3/actions';
import LaunchTestModal from './LaunchTestModal';

const ListSelectedApis = () => {
  const dispatch = useDispatch();
  const [isModalOpen, setModalOpen] = useState(false);

  const saveScenarioToBackend = async (scenarioData) => {
    const token = sessionStorage.getItem("authToken") || "";
  
    console.log("JWT token:", token); // Debug token
  
    if (!token) {
      alert("No JWT token found. Please login first.");
      return;
    }
  
    try {
      const response = await fetch("http://localhost:6060/api/scenarios", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(scenarioData),
      });
  
      if (!response.ok) {
        throw new Error("Failed to save scenario");
      }
  
      const result = await response.json();
      console.log("✅ Scenario saved:", result);
    } catch (error) {
      console.error("❌ Error saving scenario:", error);
    }
    const generateTest = await fetch("http://localhost:6060/api/api/k6/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify(scenarioData),
    });
    
  };
  

  const apiData = useSelector((state) => {
    const requestData = state.getIn(['oas3', 'requestData']);
    if (!requestData) return [];

    const jsData = requestData.toJS();
    const results = [];

    for (const [apiPath, methods] of Object.entries(jsData)) {
      for (const [method, methodData] of Object.entries(methods)) {
        results.push({
          api: apiPath,
          method: method.toUpperCase(),
          bodyValue: methodData.bodyValue || null,
          functionName: methodData.functionName || '',
          params: methodData.params || {},
        });
      }
    }

    return results;
  });

  const handleRemove = (api, method) => {
    dispatch(removeApiEntry(api, method.toLowerCase()));
  };
  const handleLaunchTest = (stageInputArray) => {
    const finalResult = generateFinalResult(stageInputArray, apiData);
    console.log(JSON.stringify(finalResult, null, 2));
  };
  const generateFinalResult = (stageInput, apiData) => {
    const stages = stageInput.map(stage => ({
      duration: stage.duration.endsWith('s') ? stage.duration : `${stage.duration}s`,
      target: Number(stage.target),
    }));


  
    const test_cases = apiData
      .filter(({ functionName }) => !!functionName)
      .map(({ api, method, bodyValue, functionName, params }) => {
        let url = api.replace(/\{\?.*?\}/, ''); // remove optional query template
        const queryParams = [];
  
        if (params) {
          Object.entries(params).forEach(([key, value]) => {
            if (key.endsWith('-path')) {
              const paramName = key.replace('-path', '');
              url = url.replace(`{${paramName}}`, value);
            } else if (key.endsWith('-query')) {
              const paramName = key.replace('-query', '');
              queryParams.push(`${encodeURIComponent(paramName)}=${encodeURIComponent(value)}`);
            }
          });
  
          if (queryParams.length > 0) {
            url += `?${queryParams.join('&')}`;
          }
        }
  
        const testCase = {
          function: functionName,
          method,
          url,
          save_as: functionName,
        };
  
        if (['POST', 'PUT', 'PATCH'].includes(method.toUpperCase()) && bodyValue) {
          try {
            testCase.payload = JSON.parse(bodyValue);
          } catch (e) {
            console.error("Invalid JSON body:", bodyValue);
            testCase.payload = {};
          }
        }
  
        return testCase;
      });
  
    return { stages, test_cases };
  };
  

  return (
    <div
      style={{
        height: 'calc(100vh - 200px)',
        width: '100%',
        maxWidth: '500px',
        border: '1px solid #ccc',
        borderRadius: '10px',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#fff',
      }}
    >
      <div style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>
        <h2 style={{ margin: 0 }}>API List</h2>
      </div>
      <LaunchTestModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        onLaunch={(stageInputs, executionOption) => handleLaunchTest(stageInputs, executionOption)}
        />

      {/* Scrollable list container */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '10px',
        }}
      >
        {!apiData.some(item => item.functionName) ? (
          <p>No APIs selected.</p>
        ) : (
          <ul style={{ paddingLeft: 0, margin: 0 }}>
            {apiData.map(({ api, method, bodyValue, functionName, params }, index) => {
              if (!functionName) return null;

              let displayApi = api.replace(/\{\?.*?\}/, '');
              let queryParams = [];

              if (params) {
                Object.entries(params).forEach(([key, value]) => {
                  if (key.endsWith('-path')) {
                    const paramName = key.replace('-path', '');
                    displayApi = displayApi.replace(`{${paramName}}`, value);
                  } else if (key.endsWith('-query')) {
                    const paramName = key.replace('-query', '');
                    queryParams.push(`${encodeURIComponent(paramName)}=${encodeURIComponent(value)}`);
                  }
                });

                if (queryParams.length > 0) {
                  displayApi += `?${queryParams.join('&')}`;
                }
              }

              return (
                <li
                  key={index}
                  style={{
                    marginBottom: '1rem',
                    listStyle: 'none',
                    padding: '10px',
                    border: '1px solid #ccc',
                    borderRadius: '8px',
                    background: '#fafafa',
                  }}
                >
                  <div><strong>Function Name:</strong> {functionName}</div>
                  <div style={{
                    wordBreak: 'break-all',
                    whiteSpace: 'normal',
                    overflowWrap: 'anywhere',
                  }}><strong>API:</strong> {displayApi}</div>
                  <div><strong>Method:</strong> {method}</div>
                  {bodyValue && (
                    <>
                      <div><strong>Body:</strong></div>
                      <pre
                        style={{
                          background: '#f0f0f0',
                          padding: '10px',
                          borderRadius: '4px',
                          overflowX: 'auto',
                          whiteSpace: 'pre-wrap',
                          wordBreak: 'break-word',
                        }}
                      >
                        {JSON.stringify(JSON.parse(bodyValue), null, 2)}
                      </pre>
                    </>
                  )}
                  <button
                    style={{
                      marginTop: '10px',
                      padding: '6px 12px',
                      backgroundColor: '#ff5f5f',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                    }}
                    onClick={() => handleRemove(api, method)}
                  >
                    Remove
                  </button>
                </li>
              );
            })}
          </ul>
        )}

      </div>

      {/* Fixed bottom button */}
      <div
        style={{
          padding: '12px',
          borderTop: '1px solid #ddd',
          textAlign: 'center',
          backgroundColor: '#f9f9f9',
        }}
      >
<button
  style={{
    padding: '10px 20px',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    fontSize: '16px',
    cursor: 'pointer',
  }}
  onClick={async () => {
    const finalResult = generateFinalResult([{ duration: "10s", target: 1 }], apiData); // you can modify stages dynamically
    await saveScenarioToBackend(finalResult);
    setModalOpen(true); // open modal after saving
  }}
>
  Add APIs to Test
</button>

      </div>
    </div>
  );
};

export default ListSelectedApis;
