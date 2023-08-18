import { useLocation } from "react-router-dom";
import UpdateForm from "../components/UpdateForm";

export default function Form() {
  const location = useLocation();

  return (
    <div className="min-h-full">
      <header className="bg-white shadow">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            {location.state ? `Update ${location.state.vacationName}` : "Create New Vacation"}
          </h1>
        </div>
      </header>
      <UpdateForm post={location.state}/>
    </div>
    );
  }