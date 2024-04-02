import { useRef, useState } from "react";
import "./App.css";
import { fetchCities } from "./fetchCities";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { useDebouncedCallback } from "use-debounce";

interface ICitiModel {
  id: number;
  name: string;
}

type Inputs = {
  city: string;
};

const defaultValues: Inputs = {
  city: "",
};

function App() {
  const [suggestionsCities, setSuggestionsCities] = useState<ICitiModel[]>([]);
  const renderCountRef = useRef(0);

  const { handleSubmit, control } = useForm<Inputs>({
    defaultValues,
  });

  renderCountRef.current++;
  console.log(`render count: ${renderCountRef.current}`);

  const onSubmit: SubmitHandler<Inputs> = (data) => console.log(data);
  const updateSuggestionsCities = useDebouncedCallback((value: string) => {
    if (value.length > 0) {
      fetchCities(value).then((result) => setSuggestionsCities(result));
    } else {
      setSuggestionsCities([]);
    }
  }, 1000);

  return (
    <>
      <h1>Test Autocomplete</h1>
      <span>using React-Hook-Form and debounce</span>
      <form
        style={{
          display: "flex",
          gap: "10px",
          justifyContent: "center",
          marginTop: 10,
        }}
        onSubmit={handleSubmit(onSubmit)}
      >
        <Controller
          control={control}
          name="city"
          defaultValue=""
          render={({ field }) => (
            <input
              type="text"
              {...field}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                field.onChange(event);
                updateSuggestionsCities(event.target.value);
              }}
            />
          )}
        />
        <button type="submit">submit</button>
      </form>
      <ul>
        {suggestionsCities.map((item) => (
          <li key={item.id}>{item.name}</li>
        ))}
      </ul>
    </>
  );
}

export default App;
