import React from "react"
import PropTypes from "prop-types"
import SwaggerUpload from "../components/SwaggerUpload"
import { checkIfSwaggerExists } from "../../services/swaggerService"

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
    }
  }

  async componentDidMount() {
    const exists = await checkIfSwaggerExists()

    if (exists) {
      const savedToken = sessionStorage.getItem("authToken")
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
      })
    } else {
      this.setState({
        isSwaggerChecked: true,
        isSwaggerReady: false,
      })
    }
  }

  handleInputChange = (e) => {
    this.setState({ [e.target.name]: e.target.value })
  }

  handleLogin = async (e) => {
    e.preventDefault()
    const { username, password } = this.state

    try {
      const response = await fetch("http://localhost:6060/api/auth/login", {
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
      const token = data.token

      if (!token) throw new Error("No token in response")

      sessionStorage.setItem("authToken", token)

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

      this.setState({ isLoggedIn: true, token })
    } catch (err) {
      this.setState({ error: err.message })
    }
  }

  renderLogin() {
    const { username, password, error } = this.state

    return (
      <div style={{
        backgroundColor: "#090D2B",
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
                  transition: "border 0.2s",
                  boxSizing: "border-box",
                  ":focus": {
                    borderColor: "rgba(255, 255, 255, 0.3)"
                  }
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
                  transition: "border 0.2s",
                  boxSizing: "border-box",
                  ":focus": {
                    borderColor: "rgba(255, 255, 255, 0.3)"
                  }
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
                cursor: "pointer",
                transition: "background-color 0.2s",
                ":hover": {
                  backgroundColor: "#2C6BEF"
                }
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

  render() {
    const { isSwaggerChecked, isSwaggerReady, isLoggedIn } = this.state

    if (!isSwaggerChecked) return null

    if (!isSwaggerReady) {
      return <SwaggerUpload onSuccess={() => window.location.reload()} />

    }

    if (!isLoggedIn) {
      return this.renderLogin()
    }

    const Layout = this.getLayout()
    return (
      <div>
        <button
          onClick={() => {
            sessionStorage.removeItem("authToken")
            this.setState({ isLoggedIn: false, token: null })
            this.props.system?.authActions?.logout()
          }}
          style={{
            position: "fixed",
            top: "10px",
            right: "10px",
            zIndex: 1000,
            padding: "10px 16px",
            borderRadius: "6px",
            backgroundColor: "#ff4d4f",
            color: "#fff",
            border: "none",
            cursor: "pointer"
          }}
        >
          Logout
        </button>
        <Layout />
      </div>
    )
  }
}

App.propTypes = {
  getComponent: PropTypes.func.isRequired,
  layoutSelectors: PropTypes.object.isRequired,
  system: PropTypes.object,
}

export default App
