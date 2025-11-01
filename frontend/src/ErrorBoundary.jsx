import React from "react";
import rollbar from "./rollbar";

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props)
        this.state = { hasError: false }
    }

    static getDerivedStateFormError() {
        return { hasError: true }
    }

    componentDidCatch(error, errorInfo) {
        rollbar.error(error, { errorInfo })
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="container">
                    <h2>Ошибка</h2>
                </div>
            )
        }
        return this.props.children
    }
}

export default ErrorBoundary