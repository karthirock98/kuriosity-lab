import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { LogOut } from "@/services/auth.service";
import { Link, useNavigate } from "react-router-dom";

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
                    <NavigationMenuTrigger className={"cursor-pointer"}>
                        Go to
                    </NavigationMenuTrigger>

                    <NavigationMenuContent>
                        <NavigationMenuLink render={<Link to={"/unsplash"} />}>
                            Unsplash Images
                        </NavigationMenuLink>
                        <NavigationMenuLink render={<Link to={"/domain-search"} />}>
                            Domain Finder
                        </NavigationMenuLink>
                        <NavigationMenuLink render={<Link to={"/detective"} />}>
                            URL Detective
                        </NavigationMenuLink>
                        <hr/>
                        <NavigationMenuLink className={"cursor-pointer"}  onClick={handleLogout}>
                            Logout
                        </NavigationMenuLink>
                    </NavigationMenuContent>
                </NavigationMenuItem>



            </NavigationMenuList>
        </NavigationMenu>
    );
};

export default NavigationMenuComp;