import {
  Banknote,
  BriefcaseBusiness,
  Bus,
  Car,
  ChartNoAxesCombined,
  CircleDollarSign,
  Dumbbell,
  Gift,
  GraduationCap,
  HandCoins,
  HeartPulse,
  Home,
  Landmark,
  Laptop,
  PiggyBank,
  Plane,
  Receipt,
  ShoppingBasket,
  ShoppingCart,
  Tags,
  Utensils
} from "lucide-react";
import type { ComponentProps } from "react";

export const categoryIcons = [
  { name: "tag", label: "Geral", icon: Tags },
  { name: "home", label: "Casa", icon: Home },
  { name: "basket", label: "Mercado", icon: ShoppingBasket },
  { name: "cart", label: "Compras", icon: ShoppingCart },
  { name: "food", label: "Comida", icon: Utensils },
  { name: "bus", label: "Onibus", icon: Bus },
  { name: "car", label: "Carro", icon: Car },
  { name: "health", label: "Saude", icon: HeartPulse },
  { name: "gym", label: "Academia", icon: Dumbbell },
  { name: "education", label: "Estudos", icon: GraduationCap },
  { name: "travel", label: "Viagem", icon: Plane },
  { name: "salary", label: "Salario", icon: Banknote },
  { name: "freelance", label: "Freela", icon: BriefcaseBusiness },
  { name: "investment", label: "Invest.", icon: ChartNoAxesCombined },
  { name: "bank", label: "Banco", icon: Landmark },
  { name: "savings", label: "Reserva", icon: PiggyBank },
  { name: "cash", label: "Dinheiro", icon: CircleDollarSign },
  { name: "bonus", label: "Bonus", icon: Gift },
  { name: "service", label: "Servico", icon: HandCoins },
  { name: "tech", label: "Tech", icon: Laptop },
  { name: "receipt", label: "Conta", icon: Receipt }
] as const;

export type CategoryIconName = (typeof categoryIcons)[number]["name"];

export function CategoryIcon({ name, ...props }: ComponentProps<typeof Tags> & { name?: string }) {
  switch (name) {
    case "home":
      return <Home {...props} />;
    case "basket":
      return <ShoppingBasket {...props} />;
    case "cart":
      return <ShoppingCart {...props} />;
    case "food":
      return <Utensils {...props} />;
    case "bus":
      return <Bus {...props} />;
    case "car":
      return <Car {...props} />;
    case "health":
      return <HeartPulse {...props} />;
    case "gym":
      return <Dumbbell {...props} />;
    case "education":
      return <GraduationCap {...props} />;
    case "travel":
      return <Plane {...props} />;
    case "salary":
      return <Banknote {...props} />;
    case "freelance":
      return <BriefcaseBusiness {...props} />;
    case "investment":
      return <ChartNoAxesCombined {...props} />;
    case "bank":
      return <Landmark {...props} />;
    case "savings":
      return <PiggyBank {...props} />;
    case "cash":
      return <CircleDollarSign {...props} />;
    case "bonus":
      return <Gift {...props} />;
    case "service":
      return <HandCoins {...props} />;
    case "tech":
      return <Laptop {...props} />;
    case "receipt":
      return <Receipt {...props} />;
    default:
      return <Tags {...props} />;
  }
}
