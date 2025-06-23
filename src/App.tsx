import { ItemForm } from './components/ItemForm';
import { AppProvider } from './contexts';

function App() {
  return (
    <AppProvider>
      <div className="min-h-screen flex justify-center items-center p-8 bg-gray-50">
        <ItemForm />
      </div>
    </AppProvider>
  );
}

export default App;
