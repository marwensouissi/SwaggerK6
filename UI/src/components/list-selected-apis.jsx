import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { removeApiEntry } from '../plugins/oas3/actions';
import LaunchTestModal from './LaunchTestModal';
import ChooseExecutionOption from './ChooseExecutionOption';
import { FaPlus } from 'react-icons/fa'; // Using Font Awesome plus icon

const HTTP_METHODS = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'];
const STORAGE_KEY = 'selectedApis';

const loadFromLocalStorage = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch (error) {
    return [];
  }
};

const ListSelectedApis = ({ swaggerFilename }) => {
  console.log("[ListSelectedApis] swaggerFilename:", swaggerFilename); // Debug
const [hasToken, setHasToken] = useState(false);

  const dispatch = useDispatch();
  
  const [isModalOpen, setModalOpen] = useState(false);
  const [generatedFilename, setGeneratedFilename] = useState(null);
  const [showLaunchModal, setShowLaunchModal] = useState(true);
  const [showExecutionOptions, setShowExecutionOptions] = useState(false);
  const [showMQTTExecutionOptions, setShowMQTTExecutionOptions] = useState(false);
  const [activeTab, setActiveTab] = useState('HTTP');
  
  // Token modal state
  const [isTokenModalOpen, setTokenModalOpen] = useState(false);
  const [tokenInput, setTokenInput] = useState('');

  // Initialize token from session storage
  useEffect(() => {
    const token = sessionStorage.getItem('authToken') || '';
    setTokenInput("");
    setHasToken(false);

  }, []);

  // Update handleSaveToken to save to localStorage as AssignedUserToken
  const handleSaveToken = () => {
    localStorage.setItem('AssignedUserToken', tokenInput); // <-- Save to localStorage
    setHasToken(!!tokenInput);
    setTokenModalOpen(false);
  };

  // const handleBackToLaunchModal = () => {
  //   setShowExecutionOptions(false);
  //   setShowLaunchModal(true);
  // };

  const handleMQTTExecution = async () => {
    if (!mqttApis.length) {
      alert("No MQTT API selected.");
      return;
    }
  
    const { functionName, params, bodyValue } = mqttApis[0];
  
    // Remove all '-path' suffixes from params keys
    const cleanedParams = {};
    Object.entries(params).forEach(([key, value]) => {
      if (key.endsWith('-path')) {
        cleanedParams[key.replace('-path', '')] = value;
      } else {
        cleanedParams[key] = value;
      }
    });
  
    // Validate credentials in bodyValue
    let parsedCredentials = [];
    try {
      const parsedBody = JSON.parse(bodyValue || '{}');
      if (Array.isArray(parsedBody.credentials)) {
        parsedCredentials = parsedBody.credentials;
      } else {
        alert("Invalid credentials format. Expected: { credentials: [ ... ] }");
        return;
      }
    } catch (err) {
      alert("Failed to parse credentials from body. Make sure it's a valid JSON.");
      return;
    }
  
    // Build the payload with actual user-provided credentials
    const payload = {
      credentials: parsedCredentials,
      parameters: [
        {
          function: functionName,
          method: "MQTT",
          save_as: functionName,
          ...cleanedParams,
        }
      ]
    };
  
    try {
      const token = sessionStorage.getItem('authToken');
      const response = await fetch('http://localhost:6060/mqtt/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
  
      console.log("MQTT payload:", payload);
  
      const result = await response.json();
      setGeneratedFilename(result.filename);
      setModalOpen(false);
      setShowMQTTExecutionOptions(true);
    } catch (error) {
      console.error('Error generating MQTT test:', error);
    }
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

  // Split apiData into HTTP and MQTT
  const httpApis = apiData.filter(item => HTTP_METHODS.includes(item.method));
  const mqttApis = apiData.filter(item => item.method === 'MQTT');

  const handleRemove = (api, method) => {
    dispatch(removeApiEntry(api, method.toLowerCase()));
  };

const handleRemoveLocal = (api, method, functionName) => {
  // Remove from localStorage
  const saved = loadFromLocalStorage();
  const updated = saved.filter(item => !(item.api === api && item.method === method && item.functionName === functionName));
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  setSavedApis(updated);
};

  const handleLaunchTest = async (stages) => {
  // Filter only HTTP APIs
  const httpTestCases = apiData
  .filter(({ method, functionName }) => HTTP_METHODS.includes(method) && !!functionName)
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
          console.error('Invalid JSON body:', bodyValue);
          testCase.payload = {};
        }
      }

      return testCase;
    });

  // Get token from localStorage as AssignedUserToken
  const assignedUserToken = localStorage.getItem('AssignedUserToken');

  // Combine stages with test cases
  const payload = {
    swagger_filename: swaggerFilename,
    stages: stages,
    test_cases: httpTestCases, // Only HTTP APIs are included
    token: assignedUserToken, // <-- Add token to payload
  };

  console.log("Complete payload:", payload);

  try {
    const token = sessionStorage.getItem('authToken');
    const response = await fetch('http://localhost:6060/generate/from-config', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    const result = await response.json();
    setGeneratedFilename(result.filename);
    setShowExecutionOptions(true);
    setModalOpen(false);
  } catch (error) {
    console.error('Error launching test:', error);
  }
};

  const getMethodColor = (method) => {
    switch (method.toLowerCase()) {
      case 'get': return '#28a745';
      case 'post': return '#0366d6';
      case 'put': return '#6f42c1';
      case 'mqtt': return '#897e06';
      case 'delete': return '#d73a49';
      case 'patch': return '#ff9a3c';
      default: return '#6a737d';
    }
  };

  // State to track MQTT injection status for each MQTT API (by functionName)
  const [mqttStatus, setMqttStatus] = useState({});
  const [isCheckingMqtt, setIsCheckingMqtt] = useState({});

  // Fetch MQTT injection status for each MQTT API entry
  useEffect(() => {
    const fetchStatuses = async () => {
      const statusObj = {};
      const checkingObj = {};
      await Promise.all(mqttApis.map(async ({ functionName }) => {
        if (!functionName) return;
        checkingObj[functionName] = true;
        try {
          const response = await fetch(`http://localhost:6060/mqtt/check-mqtt?filename=${encodeURIComponent(functionName)}`);
          if (response.ok) {
            const data = await response.json();
            statusObj[functionName] = data.injected;
          } else {
            statusObj[functionName] = false;
          }
        } catch (e) {
          statusObj[functionName] = false;
        } finally {
          checkingObj[functionName] = false;
        }
      }));
      setMqttStatus(statusObj);
      setIsCheckingMqtt(checkingObj);
    };
    if (mqttApis.length > 0) fetchStatuses();
  }, [mqttApis]);

  // State for MQTT injection status when no MQTT APIs are selected
  const [hasMqtt, setHasMqtt] = useState(false);
  const [isCheckingMqttNoApis, setIsCheckingMqttNoApis] = useState(false);

  // Check MQTT status for the current file when MQTT tab is active and no MQTT APIs are selected
  useEffect(() => {
    let timeoutId;
    let cancelled = false;
    if (activeTab === 'MQTT' && !mqttApis.some(item => item.functionName) && swaggerFilename) {
      setIsCheckingMqttNoApis(true);
      const fileNameOnly = getFileName(swaggerFilename);
      // Debounce: wait 300ms before firing the request
      timeoutId = setTimeout(() => {
        fetch(`http://localhost:6060/mqtt/check-mqtt?filename=${encodeURIComponent(fileNameOnly)}`)
          .then(res => res.ok ? res.json() : { injected: false })
          .then(data => { if (!cancelled) setHasMqtt(!!data.injected); })
          .catch(() => { if (!cancelled) setHasMqtt(false); })
          .finally(() => { if (!cancelled) setIsCheckingMqttNoApis(false); });
      }, 300);
    }
    return () => {
      cancelled = true;
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [activeTab, mqttApis.length, swaggerFilename]);

  // Utility to extract just the filename from a path or URI
const getFileName = (filePath) => {
  if (!filePath) return '';
  return filePath.split(/[/\\]/).pop();
};

  const [savedApis, setSavedApis] = useState([]);

  useEffect(() => {
    setSavedApis(loadFromLocalStorage());
  }, []);

  // Polling to update savedApis in real time
  useEffect(() => {
    const interval = setInterval(() => {
      setSavedApis(loadFromLocalStorage());
    }, 1000); // Poll every second
    return () => clearInterval(interval);
  }, []);

  // Filter savedApis for HTTP and MQTT tabs
const httpSavedApis = savedApis.filter(item => HTTP_METHODS.includes(item.method));
const mqttSavedApis = savedApis.filter(item => item.method === 'MQTT');

  return (
    <div style={{
      height: '85vh',
      width: '100%',
      width: '123%',
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
        backgroundColor: '#f6f8fa',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <h2 style={{
          margin: '-8px',
          fontSize: '18px',
          fontWeight: 600,
          color: '#24292e'
        }}>API List</h2>
        
        {/* Token Button */}
<button
  onClick={() => setTokenModalOpen(true)}
  style={{
    padding: '8px 16px',
    background: 'linear-gradient(135deg, rgb(45, 55, 72), #475a80)  ',
    color: '#e2e8f0',
    border: `1px solid ${hasToken ? '#2f70f5' : '#4a5568'}`,
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 500,
    transition: 'all 0.3s ease',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.2)'
  }}
  onMouseEnter={(e) => {
    e.target.style.background = 'linear-gradient(135deg, rgb(45, 55, 72), #475a80)';
    e.target.style.borderColor = hasToken ? '#2f70f5' : '#667eea';
  }}
  onMouseLeave={(e) => {
    e.target.style.background = 'linear-gradient(135deg, rgb(45, 55, 72), #475a80)';
    e.target.style.borderColor = hasToken ? '#2f70f5' : '#4a5568';
  }}
>
  {hasToken ? (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2f70f5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 6L9 17l-5-5"></path>
    </svg>
  ) : (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#d73a49" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18"></line>
      <line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>
  )}
  TOKEN
</button>
      </div>

      {/* Token Modal */}
      {isTokenModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          backdropFilter: 'blur(5px)'
        }}>
          <div style={{
            background: 'linear-gradient(145deg, #1a202c, #0d1117)',
            borderRadius: '16px',
            padding: '2rem',
            width: '400px',
            maxWidth: '90%',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.4)',
            color: 'white',
            border: '1px solid #2d3748',
            position: 'relative'
          }}>
            {/* Corner decorations */}
            <div style={{
              position: 'absolute',
              width: '100%',
              display: 'flex',
              justifyContent: 'space-between',
              top: 0,
              left: 0,
              padding: '1.5rem',
              pointerEvents: 'none'
            }}>

            </div>
            
            <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ 
                marginTop: 0,
                fontSize: '1.5rem',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                fontWeight: 600,
                letterSpacing: '0.5px'
              }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48l2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48l2.83-2.83"></path>
                </svg>
                Set Authentication Token
              </h3>
              <p style={{ 
                color: '#a0aec0',
                fontSize: '0.9rem',
                margin: '0.5rem 0 0'
              }}>
                Enter your API token to authenticate requests
              </p>
            </div>
            
            <div style={{ marginBottom: '1.5rem' }}>
              <input
                type="text"
                value={tokenInput}
                onChange={(e) => setTokenInput(e.target.value)}
                placeholder="Enter your token"
                style={{
                  background: 'linear-gradient(145deg, #2d3748, #1a202c)',
                  border: '1px solid #4a5568',
                  borderRadius: '8px',
                  padding: '0.85rem 1.25rem',
                  color: 'white',
                  fontSize: '0.95rem',
                  transition: 'all 0.3s ease',
                  boxShadow: 'inset 0 1px 3px rgba(0, 0, 0, 0.2)',
                  width: '100%',
                  boxSizing: 'border-box'
                }}
              />
            </div>
            
            <div style={{ 
              display: 'flex', 
              justifyContent: 'flex-end', 
              gap: '12px',
              marginTop: '1.5rem'
            }}>
              <button
                onClick={() => setTokenModalOpen(false)}
                style={{
                  padding: '0.75rem 1.5rem',
                  background: 'linear-gradient(135deg, #2d3748, #1a202c)',
                  border: '1px solid #4a5568',
                  color: '#e2e8f0',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: 500,
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = 'linear-gradient(135deg, #3b4658, #2d3748)';
                  e.target.style.borderColor = '#667eea'; 
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'linear-gradient(135deg, #2d3748, #1a202c)';
                  e.target.style.borderColor = '#4a5568';
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
                Cancel
              </button>
              <button
                onClick={handleSaveToken}
                style={{
                  padding: '0.75rem 1.5rem',
                  background: 'linear-gradient(135deg, #416fd3, #0051ff)',
                  border: 'none',
                  color: 'white',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: 500,
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = 'linear-gradient(135deg, #20b55f, #38ef7e)';
                  e.target.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'linear-gradient(135deg, #416fd3, #0051ff)';
                  e.target.style.boxShadow = 'none';
                }}
              >
                Save Token
              </button>
            </div>
          </div>
        </div>
      )}

      <div style={{ display: 'flex' }}>
        <button
          style={{
            flex: 1,
            padding: '8px 0',
            background: activeTab === 'HTTP' ? '#f6f8fa' : '#f6f8fa',
            color: activeTab === 'HTTP' ? '#24292e' : '#24292e',
            border: 'none',
            borderBottom: activeTab === 'HTTP' ? '2px solid #2f70f5' : '2px solid #eaecef',
            fontWeight: 600,
            cursor: 'pointer',
          }}
          onClick={() => setActiveTab('HTTP')}
        >
          HTTP
        </button>
        <button
          style={{
            flex: 1,
            padding: '8px 0',
            background: activeTab === 'MQTT' ? '#f6f8fa' : '#f6f8fa',
            color: activeTab === 'MQTT' ? '#24292e' : '#24292e',
            border: 'none',
            borderBottom: activeTab === 'MQTT' ? '2px solid #2f70f5' : '2px solid #eaecef',
            fontWeight: 600,
            cursor: 'pointer',
          }}
          onClick={() => setActiveTab('MQTT')}
        >
          MQTT
        </button>
      </div>

      <LaunchTestModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        onLaunch={handleLaunchTest}
        swaggerFilename={swaggerFilename}
      />
        
      {showMQTTExecutionOptions && (
        <ChooseExecutionOption
          filename={generatedFilename}
          onBack={() => setShowMQTTExecutionOptions(false)}
          onClose={() => setShowMQTTExecutionOptions(false)}
        />
      )}

      {showExecutionOptions ? (
        <ChooseExecutionOption
          filename={generatedFilename}
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
            {/* Render list based on activeTab */}
            {activeTab === 'HTTP' ? (
              httpSavedApis.length === 0 ? (
                <p style={{ textAlign: 'center', color: '#586069', padding: '20px', fontSize: '14px' }}>No HTTP APIs selected.</p>
              ) : (
                <ul style={{ paddingLeft: 0, margin: 0, listStyle: 'none' }}>
                  {httpSavedApis.map(({ api, method, bodyValue, functionName, params }, index) => {
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
                        displayApi;
                      }
                    }
                    return (
                      <li key={index} style={{ marginBottom: '16px', padding: '16px', border: '1px solid #e1e4e8', borderRadius: '8px', background: '#ffffff', transition: 'box-shadow 0.2s ease' }}>
                        <div style={{ display: 'flex', marginBottom: '8px', alignItems: 'flex-start' }}>
                          <span style={{ fontWeight: 600, color: '#24292e', minWidth: '110px', fontSize: '13px' }}>Function Name:</span>
                          <span style={{ color: '#0366d6', flex: 1, fontSize: '13px', wordBreak: 'break-word', fontWeight: 500 }}>{functionName}</span>
                        </div>
                        <div style={{ display: 'flex', marginBottom: '8px', alignItems: 'flex-start' }}>
                          <span style={{ fontWeight: 600, color: '#24292e', minWidth: '110px', fontSize: '13px' }}>API:</span>
                          <span style={{ color: '#6a737d', flex: 1, fontSize: '13px', wordBreak: 'break-word' }}>{displayApi}</span>
                        </div>
                        <div style={{ display: 'flex', marginBottom: '8px', alignItems: 'flex-start' }}>
                          <span style={{ fontWeight: 600, color: '#24292e', minWidth: '110px', fontSize: '13px' }}>Method:</span>
                          <span style={{ color: getMethodColor(method), flex: 1, fontSize: '13px', fontWeight: 500 }}>{method}</span>
                        </div>
                        {bodyValue && (
                          <div style={{ marginTop: '12px' }}>
                            <div style={{ fontWeight: 600, color: '#24292e', fontSize: '13px' }}>Body:</div>
                            <pre style={{ background: '#f6f8fa', padding: '12px', borderRadius: '6px', overflowX: 'auto', whiteSpace: 'pre-wrap', wordBreak: 'break-word', fontSize: '12px', lineHeight: 1.5, marginTop: '8px', color: 'rgb(46, 164, 79)', border: '1px solid #e1e4e8', maxHeight: '200px', overflowY: 'auto' }}>
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
                            transition: 'all 0.2s ease',
                            marginRight: '8px'
                          }}
                          onClick={() => handleRemoveLocal(api, method, functionName)}
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
<button
  style={{
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '8px 16px',
    background: 'linear-gradient(135deg, rgb(45, 55, 72), #475a80)',
    color: '#ffffff',
    border: 'none',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    height: '36px', // Standard button height
    marginLeft: '35%',
    position: 'inherit',
    top: '607px',
    right: '208px'
  }}
  onClick={() => setModalOpen(true)}
  onMouseEnter={(e) => {
    e.currentTarget.style.background = '#2c974b';
  }}
  onMouseLeave={(e) => {
    e.currentTarget.style.background = 'linear-gradient(135deg, rgb(45, 55, 72), #475a80)';
  }}
  onMouseDown={(e) => {
    e.currentTarget.style.background = '#298e46';
    e.currentTarget.style.boxShadow = 'inset 0 1px 3px rgba(0, 0, 0, 0.1)';
  }}
  onMouseUp={(e) => {
    e.currentTarget.style.background = '#2c974b';
    e.currentTarget.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)';
  }}
>
  <FaPlus style={{ marginRight: '8px', fontSize: '14px' }} />
 Create Scenario
 </button> 
 <button> ss</button>
                </ul>
              )
            ) : (
              mqttSavedApis.length === 0 ? (
                <div style={{ textAlign: 'center', color: '#586069', padding: '20px', fontSize: '14px' }}>
                  No MQTT APIs selected.
                  <br />
                  {isCheckingMqttNoApis ? (
                    <span style={{marginTop: '18px', display: 'inline-block', color: '#416fd3'}}>Checking...</span>
                  ) : !hasMqtt ? (
                    <button
                      style={{
                        marginTop: '18px',
                        padding: '8px 18px',
                        backgroundColor: '#416fd3',
                        color: '#fff',
                        border: '1px solid #416fd3',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '15px',
                        fontWeight: 600,
                        transition: 'all 0.2s ease'
                      }}
                      onClick={async () => {
                        try {
                          const fileNameOnly = getFileName(swaggerFilename);
                          const response = await fetch(`http://localhost:6060/mqtt/inject-mqtt?filename=${encodeURIComponent(fileNameOnly)}`, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: null
                          });
                          if (response.ok) {
                            const data = await response.json();
                            alert(data.message || 'MQTT injected successfully!');
                          } else {
                            alert('Failed to inject MQTT.');
                          }
                        } catch (e) {
                          alert('Error injecting MQTT.');
                        }
                      }}
                      onMouseEnter={e => { e.target.style.backgroundColor = '#0051ff'; }}
                      onMouseLeave={e => { e.target.style.backgroundColor = '#416fd3'; }}
                    >
                      Inject MQTT
                    </button>
                  ) : (
                    <span style={{marginTop: '18px', display: 'inline-block', color: '#2f70f5', fontWeight: 500}}>MQTT already injected</span>
                  )}
                </div>
              ) : (
                <ul style={{ paddingLeft: 0, margin: 0, listStyle: 'none' }}>
                  {mqttSavedApis.map(({ api, method, bodyValue, functionName, params }, index) => {
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
                        displayApi;
                      }
                    }

                    // Inject MQTT handler (placeholder)
                    const handleInjectMQTT = () => {
                      alert(`Inject MQTT for function: ${functionName}`);
                      // TODO: Implement actual inject logic here
                    };
                    const injected = mqttStatus[functionName];
                    const checking = isCheckingMqtt[functionName];
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
                            color: '#897e06',
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
                              color: 'rgb(137, 126, 6)',
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
                            transition: 'all 0.2s ease',
                            marginRight: '8px'
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
                        {/* Only show Inject MQTT if not injected and not checking */}
                        {checking ? (
                          <span style={{marginLeft: '8px', color: '#416fd3'}}>Checking...</span>
                        ) : !injected ? (
                          <button
                            style={{
                              marginTop: '12px',
                              padding: '6px 12px',
                              backgroundColor: '#416fd3',
                              color: '#fff',
                              border: '1px solid #416fd3',
                              borderRadius: '6px',
                              cursor: 'pointer',
                              fontSize: '13px',
                              fontWeight: 500,
                              transition: 'all 0.2s ease'
                            }}
                            onClick={handleInjectMQTT}
                            onMouseEnter={(e) => {
                              e.target.style.backgroundColor = '#0051ff';
                            }}
                            onMouseLeave={(e) => {
                              e.target.style.backgroundColor = '#416fd3';
                            }}
                          >
                            Inject MQTT
                          </button>
                        ) : (
                          <span style={{marginLeft: '8px', color: '#2f70f5', fontWeight: 500}}>Injected</span>
                        )}
                      </li>
                    );
                  })}
                    <button
              style={{
                padding: '7px 11px',
                backgroundColor: '#897e06',
                color: '#ffffff',
                border: 'none',
                borderRadius: '6px',
                fontSize: '14px',
                position: 'absolute',
                top: '607px',
                right: '208px',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'background-color 0.2s ease',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = '#2c974b';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = '#2f70f5';
              }}
              onMouseDown={(e) => {
                e.target.style.backgroundColor = '#298e46';
                e.target.style.boxShadow = 'inset 0 1px 3px rgba(0, 0, 0, 0.1)';
              }}
              onMouseUp={(e) => {
                e.target.style.backgroundColor = '#2c974b';
                e.target.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)';
              }}
                      onClick={handleMQTTExecution}
            >
              Add MQTT
            </button>
                </ul>
              )
            )}
          </div>

          <div style={{
            padding: '12px',
            borderTop: '1px solid #eaecef',
            textAlign: 'center',
            backgroundColor: '#f6f8fa'
          }}>
          
          </div>
        </>
      )}
    </div>
  );
};

export default ListSelectedApis;