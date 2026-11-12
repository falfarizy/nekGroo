import {Banner} from "@/app/components/banner"

export default function Home() {
    return (
        <div className="flex flex-col w-full bg-[#E4E5DA]">
            <Banner></Banner>
            <div className="w-full h-[889] pt-10 px-6">
                <div className="text-[46px] leading-15 font-fraunces">
                    <p className="text-gray-700">
                        Bulu lembut. <br></br>Hati tenang.
                    </p>
                    <p className="text-green-800">Meong senang.</p>
                </div>
                <div className="mt-4"><p className="text-gray-500">Bukan sekadar mandi. Ini waktu istimewa si meong, dengan perawatan lembut dan penuh perhatian.</p></div>
            </div>

        </div>
    );
}