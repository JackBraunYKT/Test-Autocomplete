import { useEffect, useRef, useState } from "react";
import "./App.css";
import { fetchCities } from "./fetchCities";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { useDebouncedCallback } from "use-debounce"; 
// import debounce from "debounce";

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

/*
Вариант реализации через debounce
*/

/*
const updateSuggestions = debounce(
  (value: string, abortController: AbortController, setSuggestions) => {
    if (value.length > 0) {
      fetchCities(value, abortController).then((result) =>
        setSuggestions(result)
      );
    } else {
      setSuggestions([]);
    }
  },
  1000
);
*/

function App() {
  const [suggestionsCities, setSuggestionsCities] = useState<ICitiModel[]>([]);
  const abortController = useRef<AbortController | null>(null);

  const { handleSubmit, control, setValue } = useForm<Inputs>({
    defaultValues,
  });

  const renderCountRef = useRef(0);
  renderCountRef.current++;
  console.log(`render count: ${renderCountRef.current}`);

  /*
  Вариант реализации с использованием useDebounceCallback:
  */

  const updateSuggestionsCities = useDebouncedCallback((value: string, abortController: AbortController) => {
    if (value.length > 0) {
      fetchCities(value, abortController).then((result) => setSuggestionsCities(result));
    } else {
      setSuggestionsCities([]);
    }
  }, 1000);

  // const updateSuggestionsCities = useCallback(updateSuggestions, []);

  useEffect(() => {
    return () => abortController.current?.abort?.();
  }, []);

  const onSubmit: SubmitHandler<Inputs> = (data) => console.log(data);

  return (
    <>
      <h1>Test Autocomplete</h1>
      <span>using React-Hook-Form and use-debounce</span>
      <form
        style={{
          display: "flex",
          gap: "10px",
          justifyContent: "center",
          flexDirection: 'column',
          alignItems: 'center',
          marginTop: 10,
        }}
        onSubmit={handleSubmit(onSubmit)}
      >
        <Controller
          control={control}
          name="city"
          defaultValue=""
          render={({ field }) => (
            <div className="container">
              <input
                type="text"
                {...field}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  field.onChange(event);

                  abortController.current?.abort?.();
                  abortController.current = new AbortController();
                  updateSuggestionsCities(
                    event.target.value,
                    abortController.current,
                    // setSuggestionsCities
                  );
                }}
              />
              <div className="suggestions">
                {suggestionsCities && suggestionsCities.map((item) => 
                  <div 
                    role="button"
                    key={item.id} 
                    onClick={() => {
                      setValue("city",item.name);
                      setSuggestionsCities([]);
                    }}
                  >{item.name}</div>
                )}
              </div>
            </div>
          )}
        />
        <button type="submit">submit</button>
      </form>
    </>
  );
}

export default App;
