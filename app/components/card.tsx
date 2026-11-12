interface CardProps {
    id: String;
    jenis: String;
    harga: String;
    layanan: String[];
    isSelected?: boolean;
    onSelect?: () => void
}


export default function Card({jenis, harga, layanan, isSelected=false, onSelect}: CardProps) {
    return (
        <div onClick={onSelect} className= {`w-[350] h-[339] text-black border-2  rounded-[18px] px-[20] py-6 flex flex-col justify-between select-none ${isSelected ? "border-green-800 bg-belakang" : "border-gray-300 bg-white"}`}>
            <a href="#" className="text-end font-bold">O</a>
            <p className="font-dmsans text-[10px] font-bold text-green-800">FAVORIT SI MEONG</p>
            <h2 className="font-fraunces text-[25px]">{jenis}</h2>
            <p className="text-[23px] font-bold font-dmsans">{harga}</p>
            <hr className="border-gray-400"/>
            <ul className="list-disc px-4 space-y-4 mt-2 font-dmsans text-[13px]"> {layanan.map((item,index) => (
                <li key={index}>
                    {item}
                </li>
            ))}
            </ul>
        </div>
    )
}