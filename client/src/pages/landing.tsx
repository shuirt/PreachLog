import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Church } from "lucide-react";

export default function Landing() {
  const handleLogin = () => {
    window.location.href = "/api/login";
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-primary-50 to-blue-100">
      <div className="w-full max-w-md">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-primary-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Church className="text-white text-2xl" size={32} />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Sistema de Pregação</h1>
          <p className="text-gray-600">Organize e gerencie atividades de pregação</p>
        </div>
        
        {/* Login Form */}
        <Card className="shadow-lg">
          <CardContent className="p-6">
            <form onSubmit={(e) => { e.preventDefault(); handleLogin(); }}>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="email" className="text-sm font-medium text-gray-700">Email</Label>
                  <Input 
                    id="email"
                    type="email" 
                    placeholder="seu@email.com" 
                    className="mt-1"
                    required 
                  />
                </div>
                <div>
                  <Label htmlFor="password" className="text-sm font-medium text-gray-700">Senha</Label>
                  <Input 
                    id="password"
                    type="password" 
                    placeholder="••••••••" 
                    className="mt-1"
                    required 
                  />
                </div>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="remember" />
                    <Label htmlFor="remember" className="text-gray-600">Lembrar-me</Label>
                  </div>
                  <a href="#" className="text-primary-600 hover:text-primary-700">
                    Esqueceu a senha?
                  </a>
                </div>
              </div>
              
              <Button 
                type="submit" 
                className="w-full mt-6 bg-primary-500 hover:bg-primary-600"
              >
                Entrar
              </Button>
            </form>
          </CardContent>
        </Card>
        
        {/* Demo Login */}
        <div className="mt-6 p-4 bg-white/60 rounded-lg backdrop-blur-sm">
          <p className="text-sm text-gray-600 text-center mb-3">
            Clique para entrar diretamente:
          </p>
          <div className="space-y-2">
            <Button 
              variant="outline" 
              className="w-full justify-start text-left"
              onClick={handleLogin}
            >
              <span className="font-medium">Entrar com Replit</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
