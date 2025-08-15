import React, { cloneElement, useState } from "react"
import PropTypes from "prop-types"
import {parseSearch, serializeSearch} from "core/utils"
import Upload from "core/components/Upload"
import { color } from "framer-motion"
import { MdDriveFolderUpload } from "react-icons/md";
import { FaUpload, FaTrash } from "react-icons/fa";


import ListSelectedApis from "../../../../core/components/list-selected-apis"; // Corrected path to match the actual file structure

class TopBar extends React.Component {

  static propTypes = {
    layoutActions: PropTypes.object.isRequired,
    authActions: PropTypes.object.isRequired,
    specActions: PropTypes.object.isRequired,
    specSelectors: PropTypes.object.isRequired,
    getComponent: PropTypes.func.isRequired,
    getConfigs: PropTypes.func.isRequired
  }

   constructor(props, context) {
    super(props, context)
    this.state = { 
      url: props.specSelectors.url(), 
      selectedIndex: 0,
      showUploadModal: false,
      customSpecs: [], // Store uploaded specs here
      uploadedSpecs: [], // <-- add this
      clearApiList: false // Add clearApiList state
      // Removed hasMqtt, isCheckingMqtt, isInjectingMqtt
    }
    
  }

  handleApiListCleared = () => {
    // Reset the clearApiList flag after clearing is complete
    this.setState({ clearApiList: false });
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    this.setState({ url: nextProps.specSelectors.url() })
  }

  onUrlChange =(e)=> {
    let {target: {value}} = e
    this.setState({url: value})
  }

  toggleUploadModal = () => {
    this.setState(prev => ({ showUploadModal: !prev.showUploadModal }))
  }

handleUploadSuccess = (newSpec) => {
  this.setState(prev => ({
    customSpecs: [...prev.customSpecs, newSpec],
    showUploadModal: false
  }));
  this.fetchUploadedSpecs();
  // Optionally load the new spec immediately
  this.loadSpec(newSpec.url);
}

flushAuthData() {
    const { persistAuthorization } = this.props.getConfigs()
    if (persistAuthorization)
    {
      return
    }
    this.props.authActions.restoreAuthorization({
      authorized: {}
    })
  }

deleteSpec = async () => {
  const allSpecs = [...(this.props.getConfigs().urls || []), ...this.state.customSpecs, ...this.state.uploadedSpecs];
  const currentSpec = allSpecs[this.state.selectedIndex];
  
  if (!currentSpec) return;
  
  // Only allow deletion of uploaded specs (not default URLs)
  const canDelete = currentSpec.filename || this.state.customSpecs.some(cs => cs.url === currentSpec.url);
  
  if (!canDelete) {
    alert("Cannot delete default API specifications.");
    return;
  }

  try {
    // Clear API list first
    this.setState({ clearApiList: true });
    
    // Clear localStorage
    localStorage.removeItem('selectedApis');
    
    // Collapse all operation summaries (removed showSummary and show calls that do not exist)
    // If you need to collapse summaries, implement the correct function in layoutActions
    
    // If it's an uploaded spec, delete from server
    if (currentSpec.filename) {
      const response = await fetch(`http://localhost:6060/swagger/delete-json/${currentSpec.filename}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete file from server');
      }
    }
    
    // Remove from state
    this.setState(prev => ({
      customSpecs: prev.customSpecs.filter(spec => spec.url !== currentSpec.url),
      uploadedSpecs: prev.uploadedSpecs.filter(spec => spec.url !== currentSpec.url)
    }));
    
    // Refresh the list
    this.fetchUploadedSpecs();
    
    // Switch to first available spec
    const configs = this.props.getConfigs();
    const urls = configs.urls || [];
    if (urls.length > 0) {
      this.setState({ selectedIndex: 0 });
      this.loadSpec(urls[0].url);
    }
    
    // Open upload modal after successful deletion
    // Only open upload modal if there are no specs left
const allSpecsAfterDelete = [
  ...(urls || []),
  ...this.state.customSpecs.filter(spec => spec.url !== currentSpec.url),
  ...this.state.uploadedSpecs.filter(spec => spec.url !== currentSpec.url)
];
if (allSpecsAfterDelete.length === 0) {
  this.setState({ showUploadModal: true });
}

    
  } catch (error) {
    console.error('Error deleting spec:', error);
    alert('Failed to delete file: ' + error.message);
  }
}

 async fetchUploadedSpecs() {
  try {
    const res = await fetch("http://localhost:6060/swagger/list-json");
    if (!res.ok) return;
    const data = await res.json();
    const files = data.files || [];

    // Fetch info.title for each file
    const uploadedSpecs = await Promise.all(
      files.map(async (file) => {
        try {
          const jsonRes = await fetch(`http://localhost:6060/swagger/json/${file}`);
          if (!jsonRes.ok) throw new Error();
          const json = await jsonRes.json();
          return {
            name: json.info?.title, // fallback to filename if no title
            filename: file,
            url: `http://localhost:6060/swagger/json/${file}`
          };
        } catch {
          return {
            name: file,
            url: `http://localhost:6060/swagger/json/${file}`,
            
          };
          
        }
        
      })
    );

    this.setState({ uploadedSpecs }, () => {
      // After setting uploadedSpecs, check if there is only one spec in total
      const configs = this.props.getConfigs();
      const urls = configs.urls || [];
      const allSpecs = [
        ...(urls || []),
        ...this.state.customSpecs,
        ...uploadedSpecs
      ];
      if (allSpecs.length === 1) {
        this.setState({ selectedIndex: 0 });
        this.loadSpec(allSpecs[0].url);
      }
    });
  } catch (err) {
    // handle error if needed
  }
}




  loadSpec = (url) => {
    this.flushAuthData()
    this.props.specActions.updateUrl(url)
    this.props.specActions.download(url)
  }

  onUrlSelect = (e) => {  
  let url = e.target.value || e.target.href;
  
  // Check if this is a custom uploaded spec
  const isCustomSpec = this.state.customSpecs.some(spec => spec.url === url);
  
  if (isCustomSpec) {
    // For custom specs, we might need to handle them differently
    const spec = this.state.customSpecs.find(spec => spec.url === url);
    this.loadSpec(spec.url);
  } else {
    // Default behavior for original URLs
    this.loadSpec(url);
  }
  
  this.setSelectedUrl(url);
  e.preventDefault();
}

  downloadUrl = (e) => {
    this.loadSpec(this.state.url)
    e.preventDefault()
  }

  setSearch = (spec) => {
    let search = parseSearch()
    search["urls.primaryName"] = spec.name
    const newUrl = `${window.location.protocol}//${window.location.host}${window.location.pathname}`
    if(window && window.history && window.history.pushState) {
      window.history.replaceState(null, "", `${newUrl}?${serializeSearch(search)}`)
    }
  }


getCurrentSwaggerFilename = () => {
  const currentUrl = this.props.specSelectors.url();
  console.log("Current URL in getCurrentSwaggerFilename:", currentUrl); // Debug log
  if (!currentUrl) return null;
  // Remove query string if present
  const cleanUrl = currentUrl.split('?')[0];
  return cleanUrl.split('/').pop();
};

 setSelectedUrl = (selectedUrl) => {
  const configs = this.props.getConfigs()
  const urls = configs.urls || []
const allSpecs = [
  ...(urls || []), 
  ...this.state.customSpecs, 
  ...this.state.uploadedSpecs
];

  if (allSpecs && allSpecs.length) {
    allSpecs.forEach((spec, i) => {
      if (spec.url === selectedUrl) {
        console.log(`Selected Swagger file: ${spec.filename}`); // Log the selected Swagger file name
        this.setState({ selectedIndex: i })
        this.setSearch(spec)
      }
    })
  }
}

// Update componentDidUpdate to better handle file changes
  componentDidUpdate(prevProps) {
    const currentUrl = this.props.specSelectors.url();
    const prevUrl = prevProps.specSelectors.url();
    
    if (currentUrl !== prevUrl) {
      const updatedFilename = this.getCurrentSwaggerFilename();
      console.log("Swagger file changed to:", updatedFilename);
      // Removed MQTT status reset and check
    }
  }

  // Update componentDidMount
  componentDidMount() {
    const configs = this.props.getConfigs()
    const urls = configs.urls || []

    // Try to load the first available spec from any source
    const allSpecs = [
      ...(urls || []),
      ...this.state.customSpecs,
      ...this.state.uploadedSpecs
    ];

    if (allSpecs.length === 1) {
      // Only one spec, load it
      this.setState({ selectedIndex: 0 });
      this.loadSpec(allSpecs[0].url);
    } else if (urls && urls.length) {
      // Multiple specs, use default logic
      var targetIndex = this.state.selectedIndex
      let search = parseSearch()
      let primaryName = search["urls.primaryName"] || configs.urls.primaryName
      if(primaryName)
      {
        urls.forEach((spec, i) => {
          if(spec.name === primaryName)
            {
              this.setState({selectedIndex: i})
              targetIndex = i
            }
        })
      }
      this.loadSpec(urls[targetIndex].url)
    }
    
    this.fetchUploadedSpecs();
    // Removed MQTT status check
  }


getCurrentSwaggerFilename() {
  const currentUrl = this.props.specSelectors.url();
  // Extract filename from URL (handles both local and remote files)
  const filename = currentUrl?.split('/').pop() || null;
  console.log("Current Swagger filename:", filename);
  return filename;
}



  onFilterChange =(e) => {
    let {target: {value}} = e
    this.props.layoutActions.updateFilter(value)
  }

  render() {

    
  let { getComponent, specSelectors, getConfigs } = this.props
      const Button = getComponent("Button", () => <button />)
    const Link = getComponent("Link", () => <a />)
    const Logo = getComponent("Logo", () => <span>Logo</span>)
    const ServersContainer = getComponent("ServersContainer", () => null)
    const Modal = getComponent("Modal", () => null) // Fallback if Modal doesn't exist
    const SchemesContainer = getComponent("SchemesContainer", () => null)


  let isLoading = specSelectors.loadingStatus() === "loading"
  let isFailed = specSelectors.loadingStatus() === "failed"



  const { urls } = getConfigs()
  let control = []


   const renderUploadModal = () => {
  return (
    <Upload 
      isOpen={this.state.showUploadModal}
      onClose={this.toggleUploadModal}
      onSuccess={this.handleUploadSuccess}
    />
  )
}
        const swaggerFilename = this.getCurrentSwaggerFilename();

console.log("Passing swaggerFilename to ListSelectedApis:", swaggerFilename);
<ListSelectedApis 
  swaggerFilename={swaggerFilename} 
  clearApiList={this.state.clearApiList}
  onApiListCleared={this.handleApiListCleared}
  onDebug={(payload) => console.log("Payload in ListSelectedApis:", payload)} 
/>

const allSpecs = [...(urls || []), ...this.state.customSpecs, ...this.state.uploadedSpecs];

if (allSpecs.length) {
  // Simplified dropdown without delete buttons
  const customDropdown = (
    <div className="custom-dropdown-container">
      <label className="select-label" htmlFor="select">
        <span>Select a definition</span>
        <div className="custom-select-wrapper">
          <select
            id="select"
            disabled={isLoading}
            onChange={this.onUrlSelect}
            value={allSpecs[this.state.selectedIndex]?.url}
          >
            {allSpecs.map((link, i) => (
              <option
                key={i}
                value={link.url}
                style={{ color: "#000", backgroundColor: "#fff" }}
              >
                {link.name || link.url}
              </option>
            ))}
          </select>
        </div>
      </label>
    </div>
  );

  control.push(customDropdown);
}

  const servers = specSelectors.servers()
  const schemes = specSelectors.schemes()
  const hasServers = servers && servers.size
  const Col = getComponent("Col")
  const hasSchemes = schemes && schemes.size
  const hasSecurityDefinitions = !!specSelectors.securityDefinitions()
  const AuthorizeBtnContainer = getComponent("AuthorizeBtnContainer", true)

  return (
          <div className="topbar">
        <div className="wrapper">
          <div className="topbar-wrapper">
            <Link>
              <Logo />
            </Link>
            <div className="controls-wrapper">
              <form className="download-url-wrapper">
                {control.map((el, i) => cloneElement(el, { key: i }))}
              </form>
              
              {/* Delete button for current selected file */}
              {(() => {
                const allSpecs = [...(urls || []), ...this.state.customSpecs, ...this.state.uploadedSpecs];
                const currentSpec = allSpecs[this.state.selectedIndex];
                const canDelete = currentSpec?.filename || this.state.customSpecs.some(cs => cs.url === currentSpec?.url);
                
                if (canDelete) {
                  return (
<Button 
  className="delete-btn"
  onClick={() => {
    if (window.confirm(`Are you sure you want to delete "${currentSpec.name || currentSpec.filename}"?`)) {
      this.deleteSpec();
    }
  }}
  title={`Delete ${currentSpec.name || currentSpec.filename}`}
>
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M19 7L18.1327 19.1425C18.0579 20.1891 17.187 21 16.1379 21H7.86211C6.81296 21 5.94208 20.1891 5.86732 19.1425L5 7M10 11V17M14 11V17M15 7V4C15 3.44772 14.5523 3 14 3H10C9.44772 3 9 3.44772 9 4V7M4 7H20" stroke="white" strokeWidth="2" strokeLinecap="round"/>
  </svg>
</Button>
                  );
                }
                return null;
              })()}
              
              {/* Upload button */}
              <Button 
                className="upload-btn"
                onClick={this.toggleUploadModal}
              > 
                <FaUpload />
                Upload JSON
              </Button>
              
            </div>

              { /* (hasServers || hasSchemes || hasSecurityDefinitions) && (
                <div className="scheme-container">
                  <Col className="schemes wrapper" mobile={12}>
                    <div className="schemes-server-container">
                      {hasServers && <ServersContainer />}
                      {hasSchemes && <SchemesContainer />}
                    </div>
                    {hasSecurityDefinitions && <AuthorizeBtnContainer />}
                  </Col>
                </div>
              ) */}
          </div>
        </div>

        {/* Upload Modal */}
      {renderUploadModal()}

      </div>
    )
  }
}

const styles = `
  .swagger-ui .delete-btn {
    background:linear-gradient(135deg, rgb(35, 62, 109), #0d3d9e) !important;
    width: 40px !important;
    height: 38px !important;
    border: 1px solid #2d3748 !important;
    color: white !important;
    border-radius: 6px !important;
    padding: 0 !important;
    cursor: pointer !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.4) !important;
    transition: all 0.2s ease !important;
        margin-inline: -3%;
  }

  .swagger-ui .delete-btn:hover {
    border-color: #e53e3e !important;
  }

  .swagger-ui .delete-btn > svg {
    margin: 0 !important;
  }


  .swagger-ui .upload-btn {
    background:linear-gradient(135deg, rgb(35, 62, 109), #0d3d9e) !important;
        border-radius: 6px !important;
            cursor: pointer !important;
    border: 1px solid #2d3748 !important;
        box-shadow: 0 2px 2px rgba(0, 0, 0, 0.4) !important;



  }

    .swagger-ui .upload-btn:hover {
    border-color:rgb(12, 124, 223) !important;
  }

  .swagger-ui .upload-btn > svg {
    margin-right: 3px;
  }

    .swagger-ui .delete-btn > svg {
    margin: 0px 3px;
  }

  .controls-wrapper {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .custom-dropdown-container {
    position: relative;
  }

  .custom-select-wrapper {
    position: relative;
    display: inline-block;
  }

  .upload-modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(189, 187, 187, 0.95);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
  }

  .upload-modal {
    border-radius: 4px;
    height: 40%;
    margin-bottom: 15%;
    width: 60%;
  }

  .mqtt-btn {
    background-color: #4CAF50 !important;
    color: white !important;
    border: 1px solid #4CAF50 !important;
    border-radius: 4px;
    padding: 6px 12px;
    cursor: pointer;
    font-size: 14px;
    transition: background-color 0.3s;
  }

  .mqtt-btn:hover:not(:disabled) {
    background-color: #45a049 !important;
  }

  .mqtt-btn:disabled {
    background-color: #cccccc !important;
    cursor: not-allowed;
  }
`

// Inject styles
if (typeof document !== 'undefined') {
  const styleElement = document.createElement("style")
  styleElement.textContent = styles
  document.head.appendChild(styleElement)
}


TopBar.propTypes = {
  specSelectors: PropTypes.object.isRequired,
  specActions: PropTypes.object.isRequired,
  getComponent: PropTypes.func.isRequired,
  getConfigs: PropTypes.func.isRequired
}

export default TopBar