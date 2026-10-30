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
import { Button } from "./button";
import { UserCircle2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";
import UserInfoCard, { type UserInfoCardProps } from "./UserInfoCard";
import { SESSION_STORAGE_KEYS } from "@/lib/app.constants";

const NavigationMenuComp = () => {
  const navigate = useNavigate();
  const [userProfileOpen, setUserProfileOpen] = useState(false);
  const handleLogout = () => {
    LogOut();
    navigate("/login");
  };
  const openProfile = () => {
    setUserProfileOpen(true);
  };
  const gender: any = sessionStorage.getItem(SESSION_STORAGE_KEYS.GENDER) || "";
  return (
    <>
      <NavigationMenu>
        <NavigationMenuList>
          {/* Products */}
          <NavigationMenuItem>
            <div className="flex gap-2 items-center">
              <Button
                title="My Profile"
                variant={"ghost"}
                size={"icon"}
                onClick={openProfile}
              >
                <UserCircle2 />
              </Button>
              <NavigationMenuTrigger className={"cursor-pointer"}>
                Go to
              </NavigationMenuTrigger>
            </div>

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
              <NavigationMenuLink render={<Link to={"/hormones"} />}>
                Inbuilt Drugs 
              </NavigationMenuLink>
              <NavigationMenuLink render={<Link to={"/quotes"} />}>
                Between the Lines
              </NavigationMenuLink>
              <NavigationMenuLink render={<Link to={"/maps"} />}>
                Maps
              </NavigationMenuLink>
              <NavigationMenuLink render={<Link to={"/file-box"} />}>
                File Box
              </NavigationMenuLink>
              <hr />
              <NavigationMenuLink
                className={"cursor-pointer"}
                onClick={handleLogout}
              >
                Logout
              </NavigationMenuLink>
            </NavigationMenuContent>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>

      {/* User Profile dialog */}
      <Dialog open={userProfileOpen} onOpenChange={setUserProfileOpen}>
        <DialogContent className="w-full max-w-300 max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>User Profile</DialogTitle>
            <DialogDescription>
              User information and location details.
            </DialogDescription>
          </DialogHeader>

          <UserInfoCard gender={gender} />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default NavigationMenuComp;
