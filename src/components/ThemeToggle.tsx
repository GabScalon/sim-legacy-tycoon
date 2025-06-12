
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

const ThemeToggle = () => {
  const [isDark, setIsDark] = useState(true); // Modo escuro como padrão

  useEffect(() => {
    // Verificar se há preferência salva, senão usar modo escuro como padrão
    const savedTheme = localStorage.getItem('darkMode');
    const isDarkMode = savedTheme ? savedTheme === 'true' : true; // Padrão escuro
    
    setIsDark(isDarkMode);
    localStorage.setItem('darkMode', isDarkMode.toString());
    
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleTheme = () => {
    const newDarkMode = !isDark;
    setIsDark(newDarkMode);
    localStorage.setItem('darkMode', newDarkMode.toString());
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={toggleTheme}
      className="h-9 w-9"
    >
      {isDark ? (
        <Sun className="h-4 w-4" />
      ) : (
        <Moon className="h-4 w-4" />
      )}
    </Button>
  );
};

export default ThemeToggle;
