import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { removeApiEntry } from '../plugins/oas3/actions';
import LaunchTestModal from './LaunchTestModal';
import ChooseExecutionOption from './ChooseExecutionOption';

const ListSelectedApis = () => {
  const dispatch = useDispatch();
  const [isModalOpen, setModalOpen] = useState(false);
  const [generatedFilename, setGeneratedFilename] = useState(null);
  const [showExecutionOptions, setShowExecutionOptions] = useState(false);

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

  const handleLaunchTest = async (stageInputArray) => {
    const finalResult = generateFinalResult(stageInputArray, apiData);
    console.log(JSON.stringify(finalResult, null, 2));

    try {
      const token = sessionStorage.getItem('authToken');

      const response = await fetch('http://localhost:6060/api/scenarios', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(finalResult),
      });

      const scenarioData = await response.json();

      const generateTest = await fetch('http://localhost:6060/api/api/k6/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(finalResult),
      });

      const result = await generateTest.json();
      console.log('Test generated:', result);

      setGeneratedFilename(result.filename);
      setShowExecutionOptions(true);
      setModalOpen(false);
    } catch (error) {
      console.error('Error launching test:', error);
    }
  };

  const generateFinalResult = (stageInput, apiData) => {
    const stages = stageInput.map(stage => ({
      duration: stage.duration.endsWith('s') ? stage.duration : `${stage.duration}s`,
      target: Number(stage.target),
    }));

    const test_cases = apiData
      .filter(({ functionName }) => !!functionName)
      .map(({ api, method, bodyValue, functionName, params }) => {
        let url = api.replace(/\{\?.*?\}/, '');
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
            console.error('Invalid JSON body:', bodyValue);
            testCase.payload = {};
          }
        }

        return testCase;
      });

    return { stages, test_cases };
  };

  const getMethodColor = (method) => {
    switch (method.toLowerCase()) {
      case 'get': return '#28a745';
      case 'post': return '#0366d6';
      case 'put': return '#6f42c1';
      case 'delete': return '#d73a49';
      case 'patch': return '#ff9a3c';
      default: return '#6a737d';
    }
  };

  return (
    <div style={{
      height: 'calc(100vh - 200px)',
      width: '100%',
      maxWidth: '500px',
      border: '1px solid #e1e4e8',
      borderRadius: '12px',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: '#ffffff',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
      fontFamily: "'Segoe UI', Roboto, 'Helvetica Neue', sans-serif"
    }}>
      <div style={{
        padding: '16px 20px',
        borderBottom: '1px solid #eaecef',
        backgroundColor: '#f6f8fa'
      }}>
        <h2 style={{
          margin: 0,
          fontSize: '18px',
          fontWeight: 600,
          color: '#24292e'
        }}>API List</h2>
      </div>
  
      <LaunchTestModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        onLaunch={(stageInputs) => handleLaunchTest(stageInputs)}
      />
  
      {showExecutionOptions ? (
        <ChooseExecutionOption
          filename={generatedFilename}
          onBack={() => setShowExecutionOptions(false)} // Pass onBack prop
          
          onClose={() => setShowExecutionOptions(false)}
        />
      ) : (
        <>
          <div style={{
            flex: 1,
            overflowY: 'auto',
            padding: '16px',
            backgroundColor: '#fafbfc'
          }}>
            {!apiData.some(item => item.functionName) ? (
              <p style={{
                textAlign: 'center',
                color: '#586069',
                padding: '20px',
                fontSize: '14px'
              }}>No APIs selected.</p>
            ) : (
              <ul style={{
                paddingLeft: 0,
                margin: 0,
                listStyle: 'none'
              }}>
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
                    <li key={index} style={{
                      marginBottom: '16px',
                      padding: '16px',
                      border: '1px solid #e1e4e8',
                      borderRadius: '8px',
                      background: '#ffffff',
                      transition: 'box-shadow 0.2s ease'
                    }}>
                      <div style={{
                        display: 'flex',
                        marginBottom: '8px',
                        alignItems: 'flex-start'
                      }}>
                        <span style={{
                          fontWeight: 600,
                          color: '#24292e',
                          minWidth: '110px',
                          fontSize: '13px'
                        }}>Function Name:</span>
                        <span style={{
                          color: '#0366d6',
                          flex: 1,
                          fontSize: '13px',
                          wordBreak: 'break-word',
                          fontWeight: 500
                        }}>{functionName}</span>
                      </div>
                      <div style={{
                        display: 'flex',
                        marginBottom: '8px',
                        alignItems: 'flex-start'
                      }}>
                        <span style={{
                          fontWeight: 600,
                          color: '#24292e',
                          minWidth: '110px',
                          fontSize: '13px'
                        }}>API:</span>
                        <span style={{
                          color: '#6a737d',
                          flex: 1,
                          fontSize: '13px',
                          wordBreak: 'break-word'
                        }}>{displayApi}</span>
                      </div>
                      <div style={{
                        display: 'flex',
                        marginBottom: '8px',
                        alignItems: 'flex-start'
                      }}>
                        <span style={{
                          fontWeight: 600,
                          color: '#24292e',
                          minWidth: '110px',
                          fontSize: '13px'
                        }}>Method:</span>
                        <span style={{
                          color: getMethodColor(method),
                          flex: 1,
                          fontSize: '13px',
                          fontWeight: 500
                        }}>{method}</span>
                      </div>
                      {bodyValue && (
                        <div style={{ marginTop: '12px' }}>
                          <div style={{
                            fontWeight: 600,
                            color: '#24292e',
                            fontSize: '13px'
                          }}>Body:</div>
                          <pre style={{
                            background: '#f6f8fa',
                            padding: '12px',
                            borderRadius: '6px',
                            overflowX: 'auto',
                            whiteSpace: 'pre-wrap',
                            wordBreak: 'break-word',
                            fontSize: '12px',
                            lineHeight: 1.5,
                            marginTop: '8px',
                            border: '1px solid #e1e4e8',
                            maxHeight: '200px',
                            overflowY: 'auto'
                          }}>
                            {JSON.stringify(JSON.parse(bodyValue), null, 2)}
                          </pre>
                        </div>
                      )}
                      <button
                        style={{
                          marginTop: '12px',
                          padding: '6px 12px',
                          backgroundColor: '#fafbfc',
                          color: '#d73a49',
                          border: '1px solid #d73a49',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          fontSize: '13px',
                          fontWeight: 500,
                          transition: 'all 0.2s ease'
                        }}
                        onClick={() => handleRemove(api, method)}
                        onMouseEnter={(e) => {
                          e.target.style.backgroundColor = '#d73a49';
                          e.target.style.color = 'white';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.backgroundColor = '#fafbfc';
                          e.target.style.color = '#d73a49';
                        }}
                      >
                        Remove
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
  
          <div style={{
            padding: '16px',
            borderTop: '1px solid #eaecef',
            textAlign: 'center',
            backgroundColor: '#f6f8fa'
          }}>
            <button
              style={{
                padding: '10px 20px',
                backgroundColor: '#2ea44f',
                color: '#ffffff',
                border: 'none',
                borderRadius: '6px',
                fontSize: '14px',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'background-color 0.2s ease',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
              }}
              onClick={() => setModalOpen(true)}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = '#2c974b';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = '#2ea44f';
              }}
              onMouseDown={(e) => {
                e.target.style.backgroundColor = '#298e46';
                e.target.style.boxShadow = 'inset 0 1px 3px rgba(0, 0, 0, 0.1)';
              }}
              onMouseUp={(e) => {
                e.target.style.backgroundColor = '#2c974b';
                e.target.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)';
              }}
            >
              Add APIs to Test
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default ListSelectedApis;