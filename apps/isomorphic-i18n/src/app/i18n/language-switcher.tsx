import { useRouter, usePathname } from "next/navigation";
import { SAFlag } from "@components/icons/language/SAFlag";
import { USFlag } from "@components/icons/language/USFlag";
import { useState, useEffect } from "react";

type LanguageSwitcherProps = {
  lang?: string;
  variant?: "icon" | "text";
  className?: string; // Accept additional class names
};

export default function LanguageSwitcher({ lang = "en", variant = "icon", className = "" }: LanguageSwitcherProps) {
 
  const router = useRouter();
  const pathname = usePathname();
  const newPathname = pathname.split("/").slice(2).join("/"); 
  const [currentLang, setCurrentLang] = useState(lang);

  useEffect(() => {
    if (lang) {
      setCurrentLang(lang);
    }
  }, [lang]);

  const toggleLanguage = () => {
    const newLang = currentLang === "en" ? "ar" : "en";
    setCurrentLang(newLang);
    router.push(`/${newLang}/${newPathname}`);
  };

  return (
    <button 
      onClick={toggleLanguage} 
      className={`flex items-center  h-[25px] w-10 justify-center rounded-md p-1 focus:outline-none transition-transform duration-200 hover:scale-105 ${className}`}
    >
      {variant === "icon" ? (
        currentLang === "en" ? <USFlag /> : <SAFlag />
      ) : (
        <span className="flex items-center gap-2">
          {currentLang === "en" ? <USFlag /> : <SAFlag />}
          <span>{currentLang === "en" ? "English" : "عربى"}</span>
        </span>
      )}
    </button>
  ); 
}
