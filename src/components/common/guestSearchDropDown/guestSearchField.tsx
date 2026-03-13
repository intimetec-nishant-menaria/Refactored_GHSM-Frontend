import { searchGuest } from "@/app/asyncThunk/guestThunk";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { useAppSelector } from "@/hooks/useAppSelector";
import { useEffect, useState } from "react";

interface GuestSearchProps {
  onSelect: (id: number) => void;
  error?: string;
}

const GuestSearchField = ({ onSelect, error }: GuestSearchProps) => {
  const dispatch = useAppDispatch();
  const { Guests } = useAppSelector((state) => state.guest);
  const [searchTerm, setSearchTerm] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    if (searchTerm.length <= 2 || searchTerm.includes("(")) return; 

    const id = setTimeout(() => {
      dispatch(searchGuest(searchTerm)).unwrap().catch(() => {});
      setShowDropdown(true);
    }, 500);
    return () => clearTimeout(id);
  }, [searchTerm, dispatch]);

  return (
    <div className="flex flex-col gap-1.5 relative">
      <label className="text-sm font-semibold text-slate-700">Assign Guest</label>
      <input
        type="text"
        placeholder="Search guest by name or email..."
        autoComplete="off"
        className="border border-slate-200 p-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-100 w-full"
        value={searchTerm}
        onChange={(e) => {
          setSearchTerm(e.target.value);
          setShowDropdown(true);
        }}
      />
      
      {showDropdown && Guests.length > 0 && (
        <div className="absolute top-[100%] left-0 right-0 bg-white border border-slate-200 rounded-xl mt-1 shadow-2xl z-50 max-h-48 overflow-y-auto">
          {Guests.map((g) => (
            <div
              key={g.id}
              onClick={() => {
                const displayName = `${g.name} (${g.email})`;
                setSearchTerm(displayName);
                setShowDropdown(false);
                onSelect(g.id);
              }}
              className="p-3 hover:bg-blue-50 cursor-pointer border-b last:border-0 transition-colors"
            >
              <p className="font-bold text-slate-800 text-sm">{g.name}</p>
              <p className="text-xs text-slate-500">{g.email}</p>
            </div>
          ))}
        </div>
      )}
      {error && <span className="text-red-500 text-xs italic">{error}</span>}
    </div>
  );
};

export default GuestSearchField;