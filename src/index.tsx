import { useState } from "react";
import { profiles } from "./data/profiles";
import { basePortions } from "./data/basePortions";

export default function Home() {
  const [selectedProfileKey, setSelectedProfileKey] = useState<string>("lucas");
  const [selectedMeal, setSelectedMeal] = useState<string | null>(null);
  const [selectedItems, setSelectedItems] = useState<
    Record<string, Record<string, number>>
  >({});

  const profile = profiles[selectedProfileKey];
  const mealLimits = selectedMeal ? profile.meals[selectedMeal] : {};

  const totalSelected = (category: string): number => {
    return Object.values(selectedItems[category] || {}).reduce(
      (a, b) => a + b,
      0
    );
  };

  const handleSelectItem = (category: string, item: string) => {
    setSelectedItems((prev) => {
      const prevCategory = prev[category] || {};
      const currentCount = prevCategory[item] || 0;
      const total = totalSelected(category);
      if (total >= (mealLimits[category] || 0)) return prev; // prevent going over

      return {
        ...prev,
        [category]: {
          ...prevCategory,
          [item]: currentCount + 1,
        },
      };
    });
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Nutrition Planner</h1>

      {/* Profile Selector */}
      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">Select Profile</h2>
        {Object.keys(profiles).map((key) => (
          <button
            key={key}
            onClick={() => {
              setSelectedProfileKey(key);
              setSelectedMeal(null);
              setSelectedItems({});
            }}
            className={`px-3 py-1 mr-2 rounded border ${
              selectedProfileKey === key
                ? "bg-blue-500 text-white"
                : "bg-white text-black"
            }`}
          >
            {profiles[key].name}
          </button>
        ))}
      </div>

      {/* Meal Selector */}
      {selectedProfileKey && (
        <div className="mb-4">
          <h2 className="text-lg font-semibold mb-2">Select Meal</h2>
          {Object.keys(profile.meals).map((meal) => (
            <button
              key={meal}
              onClick={() => {
                setSelectedMeal(meal);
                setSelectedItems({});
              }}
              className={`px-3 py-1 mr-2 rounded border ${
                selectedMeal === meal
                  ? "bg-green-500 text-white"
                  : "bg-white text-black"
              }`}
            >
              {meal}
            </button>
          ))}
        </div>
      )}

      {/* Portion Selector */}
      {selectedMeal && (
        <div>
          <h2 className="text-xl font-semibold mb-4">
            Plan Your {selectedMeal}
          </h2>
          {Object.entries(mealLimits).map(([category, limit]) => (
            <div key={category} className="mb-6">
              <h3 className="text-md font-semibold mb-2">
                {category} (Limit: {limit})
              </h3>
              <div className="flex flex-wrap gap-2">
                {Object.entries(basePortions[category] || {}).map(([item]) => {
                  const count = selectedItems[category]?.[item] || 0;
                  const isDisabled = totalSelected(category) >= limit;
                  return (
                    <button
                      key={item}
                      onClick={() => handleSelectItem(category, item)}
                      disabled={isDisabled}
                      className={`border px-3 py-1 rounded ${
                        isDisabled
                          ? "bg-gray-300 cursor-not-allowed"
                          : "bg-yellow-100"
                      } ${count > 0 ? "border-blue-500 font-bold" : ""}`}
                    >
                      {item} {count > 0 ? `(${count})` : ""}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
