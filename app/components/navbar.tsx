import {FloatingMenu} from "@/app/components/burgerMenu"
import Link from "next/link"

export function Navbar() {
    return (
        <div className="fixed bottom-0 py-6 max-sm:px-8 px-20 w-full flex justify-center">
            <nav className="flex flex-row items-center w-full bg-green-800 rounded-full py-2 px-6 center shadow-2xl">
                <div className="basis-1/3">
                    <a className="text-2xl font-bold" href="/">NekGroo</a>
                </div>
                <div className="basis-2/3 flex items-center gap-3 justify-end">
                    <Link className="text-black font-bold bg-amber-100 rounded-full px-5 py-3" href="/appointment">Book Now!</Link>
                    <FloatingMenu/>
                </div>
            </nav>
        </div>
    )
}