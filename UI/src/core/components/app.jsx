import React from "react"
import PropTypes from "prop-types"
import SwaggerUpload from "../components/SwaggerUpload"
import { checkIfSwaggerExists } from "../../services/swaggerService"
import AddUserModal from "./add_user"
import { TiUserAdd } from "react-icons/ti";


// K6 predefined functions list
const k6Functions = [
  { name: "randomString(length)", description: "Generates a random string of the given length." },
  { name: "randomInt(min, max)", description: "Generates a random integer between min and max." },
  { name: "check(response, conditions)", description: "Validates response against conditions." },
  { name: "sleep(seconds)", description: "Pauses execution for the given duration." },
  { name: "group(name, function)", description: "Groups test logic together." },
]

class App extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      isSwaggerReady: false,
      isSwaggerChecked: false,
      isLoggedIn: false,
      token: null,
      username: "",
      password: "",
      error: null,
      showK6Functions: false,
      showSwaggerUpload: false, 
      role: null,
      showAddUserModal: false,
      clusterStatus: null, // "on" or "off"


    }
  }

  
 async componentDidMount() {
    const exists = await checkIfSwaggerExists()
    const savedToken = sessionStorage.getItem("authToken")
    const savedRole = sessionStorage.getItem("role")

    if (exists) {
      if (savedToken && this.props.system?.authActions?.authorize) {
        this.props.system.authActions.authorize({
          apiKey: {
            name: "Authorization",
            schema: {
              type: "apiKey",
              in: "header",
              name: "Authorization",
            },
            value: `Bearer ${savedToken}`,
          },
        })
      }
      this.setState({
        isSwaggerChecked: true,
        isSwaggerReady: true,
        isLoggedIn: !!savedToken,
        token: savedToken,
        role: savedRole,

      })
    } else {
      this.setState({
        isSwaggerChecked: true,
        isSwaggerReady: false,
        isLoggedIn: !!savedToken,
        token: savedToken,
        role: savedRole,

      })
    }
  }

  async fetchClusterStatus() {
    try {
      const response = await fetch("http://localhost:6060/jenkins/check");
      const data = await response.json();
      
      if (data.cluster_exists === true) {
        this.setState({ clusterStatus: "on" });
      } else if (data.cluster_exists === false) {
        this.setState({ clusterStatus: "off" });
      } else {
        this.setState({ clusterStatus: "unknown" });
      }
    } catch (error) {
      console.error("Error fetching cluster status:", error);
      this.setState({ clusterStatus: "unknown" });
    }
  }
  
  async componentDidMount() {
    const exists = await checkIfSwaggerExists();
    const savedToken = sessionStorage.getItem("authToken");
    const savedRole = sessionStorage.getItem("role");
  
    if (savedToken && this.props.system?.authActions?.authorize) {
      this.props.system.authActions.authorize({
        apiKey: {
          name: "Authorization",
          schema: {
            type: "apiKey",
            in: "header",
            name: "Authorization",
          },
          value: `Bearer ${savedToken}`,
        },
      });
    }
  
    await this.fetchClusterStatus(); // ⬅️ Call the fetch here
  
    this.setState({
      isSwaggerChecked: true,
      isSwaggerReady: exists,
      isLoggedIn: !!savedToken,
      token: savedToken,
      role: savedRole,
    });
  }
  

  handleInputChange = (e) => {
    this.setState({ [e.target.name]: e.target.value })
  }

  handleLogin = async (e) => {
    e.preventDefault()
    const { username, password } = this.state
  
    try {
      const response = await fetch("http://localhost:6060/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      })
  
      if (!response.ok) {
        const msg = await response.text()
        throw new Error(msg || "Login failed")
      }
  
      const data = await response.json()
  
      const token = data.access_token
      if (!token) throw new Error("No access_token in response")
  
      sessionStorage.setItem("authToken", token)
  
      // Optional: you can store other info if needed
      sessionStorage.setItem("username", data.username)
      sessionStorage.setItem("role", data.role)
      sessionStorage.setItem("userId", data.user_id)
  
      this.props.system?.authActions?.authorize({
        apiKey: {
          name: "Authorization",
          schema: {
            type: "apiKey",
            in: "header",
            name: "Authorization",
          },
          value: `Bearer ${token}`,
        },
      })
  
      this.setState({ isLoggedIn: true, token, role: data.role })
    } catch (err) {
      this.setState({ error: err.message })
    }
    // ...inside handleLogin after sessionStorage.setItem("role", data.role)
  }
  
  renderLogin() {
    const { username, password, error } = this.state

    return (
      <div style={{
        // backgroundColor: "#090D2B",
            background:"linear-gradient(145deg, rgb(37, 53, 79), rgb(11, 14, 19))",

        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif"
      }}>
        <div style={{
          backgroundColor: "rgba(255, 255, 255, 0.05)",
          borderRadius: "12px",
          padding: "40px",
          width: "100%",
          maxWidth: "420px",
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2)",
          backdropFilter: "blur(8px)",
          border: "1px solid rgba(255, 255, 255, 0.1)"
        }}>
          <div style={{ textAlign: "center", marginBottom: "30px" }}>
            <img 
              src="https://kian-technology.com/wp-content/uploads/2024/06/light-logo.png.webp" 
              alt="Company Logo"
              style={{ 
                height: "60px",
                marginBottom: "20px"
              }}
            />
            <h2 style={{
              color: "#fff",
              margin: "0",
              fontSize: "24px",
              fontWeight: "600"
            }}>Welcome Back</h2>
            <p style={{
              color: "rgba(255, 255, 255, 0.7)",
              marginTop: "8px",
              fontSize: "14px"
            }}>Please enter your credentials to continue</p>
          </div>

          {error && (
            <div style={{
              backgroundColor: "rgba(255, 59, 48, 0.2)",
              color: "#FF3B30",
              padding: "12px",
              borderRadius: "8px",
              marginBottom: "20px",
              fontSize: "14px"
            }}>
              {error}
            </div>
          )}

          <form onSubmit={this.handleLogin}>
            <div style={{ marginBottom: "20px" }}>
              <label style={{
                display: "block",
                color: "rgba(255, 255, 255, 0.8)",
                marginBottom: "8px",
                fontSize: "14px",
                fontWeight: "500"
              }}>Username</label>
              <input
                type="text"
                name="username"
                placeholder="Enter your username"
                value={username}
                onChange={this.handleInputChange}
                required
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  borderRadius: "8px",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  backgroundColor: "rgba(255, 255, 255, 0.05)",
                  color: "#fff",
                  fontSize: "14px",
                  outline: "none",
                  boxSizing: "border-box"
                }}
              />
            </div>

            <div style={{ marginBottom: "30px" }}>
              <label style={{
                display: "block",
                color: "rgba(255, 255, 255, 0.8)",
                marginBottom: "8px",
                fontSize: "14px",
                fontWeight: "500"
              }}>Password</label>
              <input
                type="password"
                name="password"
                placeholder="Enter your password"
                value={password}
                onChange={this.handleInputChange}
                required
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  borderRadius: "8px",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  backgroundColor: "rgba(255, 255, 255, 0.05)",
                  color: "#fff",
                  fontSize: "14px",
                  outline: "none",
                  boxSizing: "border-box"
                }}
              />
            </div>

            <button
              type="submit"
              style={{
                width: "100%",
                padding: "14px",
                backgroundColor: "#3A7BFA",
                color: "#fff",
                border: "none",
                borderRadius: "8px",
                fontSize: "16px",
                fontWeight: "600",
                cursor: "pointer"
              }}
            >
              Sign In
            </button>
          </form>

          <div style={{
            marginTop: "30px",
            textAlign: "center",
            color: "rgba(255, 255, 255, 0.6)",
            fontSize: "13px"
          }}>
            <p>Need help? <a href="#" style={{ color: "#3A7BFA", textDecoration: "none" }}>Contact support</a></p>
          </div>
        </div>
      </div>
    )
  }

  getLayout() {
    const { getComponent, layoutSelectors } = this.props
    const layoutName = layoutSelectors.current()
    const Component = getComponent(layoutName, true)
    return Component || (() => <h1>No layout defined for "{layoutName}"</h1>)
  }

 renderNoSwagger() {
    return (
      <div style={{
        minHeight: "100vh",
        background: "linear-gradient(145deg, #1a202c, #0d1117)",
        color: "#fff",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "'Segoe UI', sans-serif"
      }}>
        <h2>No Swagger file uploaded</h2>
        <p style={{ color: "rgba(255,255,255,0.7)", marginBottom: 24 }}>
          Please upload a Swagger JSON file to continue.
        </p>
        <button
          onClick={() => this.setState({ showSwaggerUpload: true })}
          style={{
            padding: "12px 28px",
            backgroundColor: "#84BD00",
            color: "#090D2B",
            borderRadius: "6px",
            border: "none",
            fontWeight: 600,
            fontSize: "16px",
            cursor: "pointer"
          }}
        >
          Upload JSON
        </button>
        {this.state.showSwaggerUpload && (
          <div style={{
            position: "fixed",
            top: 0, left: 0, right: 0, bottom: 0,
            background: "rgba(0,0,0,0.6)",
            zIndex: 2000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}>
            <div style={{ background: "#090D2B", borderRadius: 12, padding: 32, position: "relative" }}>
              <button
                onClick={() => this.setState({ showSwaggerUpload: false })}
                style={{
                  position: "absolute", top: 10, right: 10,
                  background: "none", border: "none", color: "#fff", fontSize: 24, cursor: "pointer"
                }}
                aria-label="Close"
              >×</button>
            </div>
          </div>
        )}
      </div>
    )
  }

  render() {
    const { isSwaggerChecked, isSwaggerReady, isLoggedIn, showK6Functions } = this.state

    if (!isSwaggerChecked) return null

    if (!isLoggedIn) {
      return this.renderLogin()
    }

  

    const Layout = this.getLayout()

    return (
  <div>
    {/* Navigation Bar */}
    <div style={{
      position: "fixed",
      top: "22px",
      right: "10px",
      zIndex: 1000,
      display: "flex",
      alignItems: "center",
      gap: "8px",
      color: "white",
      fontSize: "14px",
      fontFamily: "Arial, sans-serif"
    }}>
         
      {/* Cluster Status */}
 <div style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "8px 16px",
            borderRadius: "6px",
            backgroundColor: "rgb(83 16 16 / 10%)"
          }}>
            <div style={{
              width: "10px",
              height: "10px",
              borderRadius: "50%",
              backgroundColor: this.state.clusterStatus === "on" ? "#52c41a" : "#ff4d4f",
              boxShadow: this.state.clusterStatus === "on" ? "0 0 8px #52c41a" : "0 0 8px #ff4d4f"
            }} />
            <span>Cluster: </span>
            <span style={{
              color: this.state.clusterStatus === "on" ? "#52c41a" : "#ff4d4f",
              fontWeight: "bold"
            }}>
              {this.state.clusterStatus === "on" ? "ONLINE" : "OFFLINE"}
            </span>
          </div>

      <span>|</span>
      {/* K6 Functions Link */}
      <div style={{ display: "flex", alignItems: "center" }}>
        <span 
          onClick={() => this.setState({ showK6Functions: !showK6Functions })}
          style={{ cursor: "pointer", display: "flex", alignItems: "center" }}
        >
          <span role="img" aria-label="functions" style={{ marginRight: "4px" }}>⚙️</span>
          K6 Functions
        </span>
      </div>
       

          

      
      {this.state.role === "admin" && (
        <>
          <span>|</span>
          <div style={{ display: "flex", alignItems: "center" }}>
            <span 
              onClick={() => this.setState({ showAddUserModal: true })}
              style={{ cursor: "pointer", display: "flex", alignItems: "center"}}
            >
              {/* <span role="img" aria-label="add user" style={{ marginRight: "4px" }}>👤</span> */}
              {/* Add User */}
              <TiUserAdd />

            </span>
          </div>
        </>
      )}
      
      
      {/* Logout Link */}
      <div style={{ display: "flex", alignItems: "center" }}>
        <span 
          onClick={() => {
            sessionStorage.removeItem("authToken");
            this.setState({ isLoggedIn: false, token: null });
            this.props.system?.authActions?.logout();
          }}
          style={{ cursor: "pointer", display: "flex", alignItems: "center" }}
        >
          <span role="img" aria-label="logout" style={{ marginRight: "4px" }}>🚪</span>
          Logout
        </span>
      </div>
    </div>

    {/* K6 Function List Display */}
    {showK6Functions && (
      <div style={{
        position: "fixed",
        top: "60px",
        right: "140px",
        zIndex: 999,
        width: "300px",
        backgroundColor: "#2d3748",
        border: "1px solid #ccc",
        borderRadius: "8px",
        padding: "16px",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
        fontSize: "14px",
        color: "#000"
      }}>
        <h4 style={{ margin: "0 0 10px" }}>K6 Utility Functions</h4>
        <ul style={{ paddingLeft: "20px", margin: 0 }}>
          {k6Functions.map((fn, idx) => (
            <li key={idx} style={{ marginBottom: "8px" }}>
              <strong>{fn.name}</strong><br />
              <span style={{ fontSize: "12px", color: "#949ea6" }}>{fn.description}</span>
            </li>
          ))}
        </ul>
      </div>
    )}

    <AddUserModal
      isOpen={this.state.showAddUserModal}
      onClose={() => this.setState({ showAddUserModal: false })}
    />
    <Layout />
  </div>
)}}
App.propTypes = {
  getComponent: PropTypes.func.isRequired,
  layoutSelectors: PropTypes.object.isRequired,
  system: PropTypes.object,
}

export default App
