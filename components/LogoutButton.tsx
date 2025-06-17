"use client"

import { Button } from "@/components/ui/button"
import { signOut } from "@/lib/actions/auth.action"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

const LogoutButton = () => {
    const router = useRouter();

    const handleLogout = async () => {
        try {
            const result = await signOut();
            
            if (result.success) {
                toast.success(result.message);
                router.push("/sign-in");
            } else {
                toast.error(result.message);
            }
        } catch (error) {
            console.error("Error signing out:", error);
            toast.error("Failed to sign out");
        }
    };

    return (
        <Button 
            variant="outline" 
            className="text-destructive hover:text-destructive hover:bg-destructive/10"
            onClick={handleLogout}
        >
            Sign Out
        </Button>
    );
};

export default LogoutButton; 