import { useSelector } from "react-redux";
import Home from "./pages/Home";
import ErrorPage from "./components/ErrorPage";

function App() {
  const { showErrorPage } =
    useSelector((state) => state.app);

  if (showErrorPage) {
    return <ErrorPage onRetry={() => {window.location.reload()}} />; // Show error page if API call fails
  }

  return (
    <div>
      <Home />
    </div>
  );
}

export default App;