import { Button } from "./components/ui/button";

const App = () => {
  return (
    <div className="h-screen flex flex-col items-center justify-center">
      <h1>Care Notes Mini</h1>
      <div>
        <ul>
          <li>note 1</li>
          <li>note 2</li>
          <li>note 3</li>
        </ul>
      </div>
      <Button>Add Note </Button>
    </div>
  );
};

export default App;
