import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { LogOut } from "@/services/auth.service";
import { useNavigate } from "react-router-dom";

const NavigationMenuComp = () => {
    const navigate = useNavigate();
    const handleLogout = () => {
        LogOut();
        navigate("/login");
    }
    return (
        <NavigationMenu>
            <NavigationMenuList>

                {/* Products */}
                <NavigationMenuItem>
                    <NavigationMenuTrigger>
                        Menu
                    </NavigationMenuTrigger>

                    <NavigationMenuContent>
                        {/* <NavigationMenuLink>
                            Product One
                        </NavigationMenuLink> */}

                        <NavigationMenuItem>
                            <button
                                type="button"
                                onClick={handleLogout}
                                className="cursor-pointer"
                            >
                                Logout
                            </button>
                        </NavigationMenuItem>
                    </NavigationMenuContent>
                </NavigationMenuItem>



            </NavigationMenuList>
        </NavigationMenu>
    );
};

export default NavigationMenuComp;