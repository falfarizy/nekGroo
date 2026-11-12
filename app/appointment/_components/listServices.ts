export interface Services {
    id:string,
    paket:string,
    harga:string,
    layanan:string[],
}

// Harga kitten lebih murah Rp 5.000 dari harga adult
export const POTONGAN_HARGA_KITTEN = 5000

// Hitung harga kitten dari harga adult (contoh: "Rp 40.000" -> "Rp 35.000")
export function hargaKitten(hargaAdult: string): string {
    const angkaAdult = Number(hargaAdult.replace(/[^\d]/g, ""))
    const angkaKitten = Math.max(0, angkaAdult - POTONGAN_HARGA_KITTEN)
    return `Rp ${angkaKitten.toLocaleString("id-ID")}`
}

export interface CatForm {
    name: string,
    ras: string,
    age: string,
    gender: string,
    selectedServiceId: string;
}

export const SERVICES: Services[] = [
    {
        id:"daily",
        paket:"Grooming Sehat" ,
        harga:"Rp 40.000" ,
        layanan: ['Mandi & Pengering', 'Potong Kuku', 'Bersihkan telinga dan sisir bulu']
    },
    {
        id:"kutu",
        paket:"Grooming Kutu" ,
        harga:"Rp 45.000" ,
        layanan: ['Mandi & Pengering', 'Potong Kuku', 'Bersihkan telinga dan sisir bulu']
    },
    {
        id:"jamur",
        paket:"Grooming Jamur" ,
        harga:"Rp 50.000" ,
        layanan: ['Mandi & Pengering', 'Potong Kuku', 'Bersihkan telinga dan sisir bulu']
    },
    {
        id:"lengkap",
        paket:"Grooming Lengkap" ,
        harga:"Rp 60.000" ,
        layanan: ['Degreaser', 'Deep Cleaning', 'Treatment Jamur Kutu']
    },
]