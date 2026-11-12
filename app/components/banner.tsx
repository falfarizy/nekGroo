export function Banner() {
    const bannerText= "Meong bersih, hati senang! Pakai MIYUSAYANG untuk diskon 10% grooming."

    return (
        <div className="w-full h-[58] bg-green-800 px-[20] py-[12] content-center">
            <p className="text-[11px] text-center">{bannerText}</p>
        </div>
    )
}