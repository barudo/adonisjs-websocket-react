import ChatBox from "./components/ChatBox";
import { Provider } from 'react-redux'
import store from './redux/store'

function App() {
  return (
    <div className="App">
      <Provider store={store}>
        <ChatBox />
      </Provider>
    </div>
  );
}

export default App;
