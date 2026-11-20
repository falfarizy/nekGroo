"use client"
import { useEffect, useState } from "react"
import Form from "./_components/formK/formKucing"
import CardsLayout from "./_components/cardLayout"
import Step from "./_components/step"
import { SERVICES, CatForm, CustomerForm } from "./_components/formK/listServices"
import FormCust from "./_components/formK/formCust"
import Schedule from "./_components/jadwal/schedule"
import { formatLongDate, getAvailableSlots } from "./_components/jadwal/calendar/utils"
import BarangLayout from "./_components/jastip/barangLayout"
import ConfirmAkhir from "./_components/confirmAkhir/page"
import { buatRingkasan, DAFTAR_BARANG } from "./_components/jastip/_components/listBarang"

// Kurangi jumlah layanan dari urutan terakhir jika tanggal baru punya lebih sedikit slot.
function clampQuantities(quantities: Record<string, number>, max: number): Record<string, number> {
    let sisa = max
    const result: Record<string, number> = {}

    for (const [id, qty] of Object.entries(quantities)) {
        const next = Math.min(Math.max(0, qty), sisa)
        result[id] = next
        sisa -= next
    }

    return result
}

export default function Appointment() {
    // Page navigation
    const [page, setPage] = useState<number>(1)
    //Jumlah layanan yang dipilih 
    const [quantity, setQuantity] = useState<Record<string, number>>({}) 
    //jumlah form tergantung jumlah layanan
    const [formList, setFormList] = useState<CatForm[]>([]) 
    //persetujuan syarat sebelum kirim data
    const [isAgreed, setIsAgreed] = useState(false)
    // Jadwal
    const [selectedDate, setSelectedDate] = useState<string | null>(null)

    // Kuota layanan mengikuti sisa slot pada tanggal yang dipilih
    const availableSlots = selectedDate ? getAvailableSlots(selectedDate) : 0
    const totalSelected = Object.values(quantity).reduce((acc, q) => acc + q, 0)
    const remainingSlots = Math.max(0, availableSlots - totalSelected)

    useEffect(() => {
        window.scrollTo({top:0, behavior:"smooth"})
    },[page])

    // Ganti tanggal: sesuaikan lagi jumlah layanan jika slotnya lebih sedikit
    const handleDateChange = (date:string) => {
        setSelectedDate(date)
        setQuantity((prev) => clampQuantities(prev, getAvailableSlots(date)))
    }

    // handler jumlah layanan (+ -)
    const handleQuantityChange = (id:string, nilaiPerubahan:number) => {
        setQuantity((prev) => {
            const current = prev[id] || 0
            const next = Math.max(0, current + nilaiPerubahan)

            if (nilaiPerubahan > 0) {
                const total = Object.values(prev).reduce((acc, q) => acc + q, 0)
                if (total >= availableSlots) return prev
            }

            return {...prev, [id]:next}
        })
    }
    
    //jika card dipilih quantity = 1 : 0
    const handleToggleSelect = (id:string) => {
        setQuantity((prev) => {
            const current =  prev[id] || 0
            if (current > 0) return {...prev, [id]:0}

            const total = Object.values(prev).reduce((acc, q) => acc + q, 0)
            if (total >= availableSlots) return prev

            return {
                ...prev,
                [id]: 1
            }
        })
    }

    // tampilkan form sesuai jumlah layanan dipilih
    const handleNextToPageTwo = () => {
        if (totalSelected === 0 || totalSelected > availableSlots) {
            return
        }

        const initialForms: CatForm[] = Array.from({length:totalSelected}, () => ({
            name: "",
            ras: "",
            age: "",
            gender: "",
            selectedServiceId: ""
        }))

        setFormList(initialForms)
        setPage(3)
    }

    const handleFormChange = (index:number, updatedData: CatForm) => {
        setFormList((prev) => 
            prev.map((item, idx) => (idx === index?updatedData:item))
        )
    }

    // Filter card terpilih
    const selectedServiceList = SERVICES.filter((item) => (quantity[item.id] || 0) > 0)

    // cek satu form sudah terisi lengkap
    const isFormComplete = (form: CatForm) =>
        form.name.trim() !== "" &&
        form.ras.trim() !== "" &&
        form.age !== "" &&
        form.gender !== "" &&
        form.selectedServiceId !== ""

    // semua form harus terisi dulu sebelum bisa kirim data
    const isAllFormsComplete = formList.length > 0 && formList.every(isFormComplete)


    const [catFormData, setCatFormData] = useState<CatForm[]>()

    // Form submit
    const handleFinalSubmit = (e:React.FormEvent) => {
        e.preventDefault()
        const incompleteFormIndex = formList.findIndex((f) => !isFormComplete(f))
        if (incompleteFormIndex !== -1) {
            alert(`Harap lengkapi semua data pada Meong ${incompleteFormIndex + 1}!`);
            return;
        }

        if (!isAgreed) {
            alert("Harap centang pernyataan sebelum mengirim data!");
            return;
        }

        // console.log("Submit All Forms Data:", formList);
        setCatFormData(formList)
        // alert("Data berhasil dikirim!");
        setPage(4)

    }

    // Customer
    const [customer, setCustomer] = useState<CustomerForm>({
        name: "",
        phone: "",
        alamat: "",
    })
    const handleCustomerChange = (data: CustomerForm) => setCustomer(data)

    const isFormCustomerCompleted = customer.name.trim() !== "" && customer.phone !== "" && customer.alamat.trim() !== ""

    // Jasa titip
    const [jastipQuantities, setJastipQuantities] = useState<Record<string, number>>({})
    const ringkasanJastip = buatRingkasan(jastipQuantities)

    const handleJastipQuantityChange = (id:string, delta:number) => {
        setJastipQuantities((prev) => {
            const current = prev[id] || 0
            const stok = DAFTAR_BARANG.find((barang) => barang.id === id)?.stok ?? 0
            const next = Math.min(stok, Math.max(0, current + delta))
            return {...prev, [id]:next}
        })
    }

    const handleJastipToggle = (id:string) => {
        setJastipQuantities((prev) => {
            const current = prev[id] || 0
            const stok = DAFTAR_BARANG.find((barang) => barang.id === id)?.stok ?? 0
            if (stok === 0) return prev
            return {...prev, [id]: current > 0 ? 0 : 1}
        })
    }

    const handleConfirmSchedule = () => {
        if (!selectedDate) {
            alert("Harap pilih tanggal terlebih dahulu!");
            return;
        }

        console.log("Data appointment:", {
            customer,
            cats: catFormData ?? formList,
            date: selectedDate,
        });
        alert(`Jadwal berhasil dipilih: ${selectedDate}`);
    }


    return (
        <div className="bg-[#E4E5DA]">
            <Step 
                page = {page}
            />

            {/* Pilih Jadwal */}
            {page == 1 &&
            (
                <div className="h-fit px-6 py-8 bg-[#E4E5DA] flex flex-col gap-6">
                    <div className="flex flex-col gap-2">
                        <h1 className="text-black font-fraunces text-[30px] text-center">Pilih Jadwal</h1>
                        <p className="font-dmsans text-[14px] text-[#737A70] text-center leading-6">
                            Pilih tanggal kedatangan si meong. Tanggal yang sudah penuh tidak dapat dipilih.
                        </p>
                    </div>

                    <Schedule
                        value={selectedDate}
                        onChange={handleDateChange}
                    />

                    <button
                        onClick={() => {handleConfirmSchedule;setPage(2);console.log(selectedDate)}}
                        disabled={!selectedDate}
                        className="bg-green-800 hover:bg-green-900 h-[50] rounded-[20px] disabled:bg-gray-400 disabled:cursor-not-allowed disabled:hover:bg-gray-400"
                    >
                        Konfirmasi Jadwal
                    </button>
                </div>
            )}

            {/* Pilih Card */}
            {page===2 &&
            (
                <div className="h-fit px-6 py-8 bg-[#E4E5DA] flex flex-col gap-6">
                    <div className="flex flex-col gap-4 mb-4">
                        <h1 className="font-fraunces text-[#233D31] text-[32px] leading-10">Perawatan yang pas untuk si meong.</h1>
                        <p className="font-dmsans text-[14px] text-[#737A70] leading-6">Pilih paket grooming untuk si meong. Setiap sesi ditangani dengan sabar oleh groomer khusus kucing.</p>
                        <p className="font-dmsans text-[13px] text-[#233D31]">
                            {selectedDate
                                ? `Slot ${formatLongDate(selectedDate)}: ${totalSelected}/${availableSlots} dipilih. ${
                                    remainingSlots > 0
                                        ? `Sisa ${remainingSlots} slot.`
                                        : "Semua slot sudah terpakai."
                                }`
                                : "Pilih tanggal terlebih dahulu."}
                        </p>
                    </div>
                    <CardsLayout
                        quantities={quantity}
                        canAdd={remainingSlots > 0}
                        onQuantityChange={handleQuantityChange}
                        onToggleSelect={handleToggleSelect}
                    />
                    <button onClick={handleNextToPageTwo} className="bg-green-800 rounded-[20px] h-[50] hover:bg-green-900" >
                        Next Page
                    </button>
                </div>
            )}

            {/* Isi Form Kucing */}
            {page==3 &&
            (
                <div className="h-fit px-6 py-8 bg-[#E4E5DA] flex flex-col gap-6">
                    <h1 className="text-black font-fraunces text-[30px] text-center">Tentang Si Meong</h1>
                    <form onSubmit={handleFinalSubmit} className="flex flex-col gap-6">
                        {formList.map((formData, index) => {
                            // Sebuah layanan boleh dipakai beberapa form,
                            // sebanyak jumlah (quantity) yang dipilih di halaman 1.
                            const availableOptionsForThisForm = selectedServiceList.filter((s) => {
                                const usedByOthers = formList.filter(
                                    (f, idx) => idx !== index && f.selectedServiceId === s.id
                                ).length
                                const quota = quantity[s.id] || 0
                                return usedByOthers < quota || s.id === formData.selectedServiceId
                            })
                            

                            return (
                                <Form
                                    key={index}
                                    formIndex={index}
                                    formData={formData}
                                    availableOption={availableOptionsForThisForm}
                                    onChange={handleFormChange}
                                />
                            );
                        })}
                        <label htmlFor="agree" className="text-gray-800 text-[11px] flex items-start gap-2">
                            <input type="checkbox" id="agree" checked={isAgreed} onChange={(e) => setIsAgreed(e.target.checked)} className="mt-0.5" required/>Saya memastikan bahwa kucing sedang tidak dalam kondisi hamil, tidak sedang sakit, dan tidak galak
                        </label>
                        {/* {!isAllFormsComplete && (
                            <p className="text-[12px] text-red-600 text-center">
                                Lengkapi semua data kucing terlebih dahulu sebelum mengirim.
                            </p>
                        )} */}
                        <button
                            type="submit"
                            disabled={!isAllFormsComplete || !isAgreed}
                            className="bg-green-800 hover:bg-green-900 h-[50] rounded-[20px] disabled:bg-gray-400 disabled:cursor-not-allowed disabled:hover:bg-gray-400"
                        >
                            Kirim Data
                        </button>
                    </form>
                    <button onClick={() => setPage(2)} className="bg-green-800 rounded-[20px] h-[50] hover:bg-green-900">
                        Previous
                    </button>
                </div>
            )}

            {/* Isi data customer */}
            {page == 4 &&
            (
                <div className="flex flex-col px-6 py-8 gap-4">
                    <form action=""
                        className="">
                        <FormCust
                            formData={customer}
                            onChange={handleCustomerChange}
                        />
                    </form>
                    <button
                        onClick={() => setPage(5)}
                        disabled={!isFormCustomerCompleted}
                        className="bg-green-800 rounded-[20px] h-[50] hover:bg-green-900 disabled:bg-gray-400 disabled:cursor-not-allowed disabled:hover:bg-gray-400"
                    >
                        Next
                    </button>
                </div>
            )}

            {/* Jasa titip */}
            {page === 5 && (
                <>
                    <BarangLayout
                        quantities={jastipQuantities}
                        onQuantityChange={handleJastipQuantityChange}
                        onToggleSelect={handleJastipToggle}
                    />
                    <div className="flex flex-col gap-3 px-6 pb-44">
                        <button
                            onClick={() => setPage(6)}
                            className="bg-green-800 rounded-[20px] h-[50] hover:bg-green-900"
                        >
                            Lanjut Konfirmasi
                        </button>
                        <button
                            onClick={() => setPage(4)}
                            className="bg-green-800 rounded-[20px] h-[50] hover:bg-green-900"
                        >
                            Previous
                        </button>
                    </div>
                </>
            )}

            {/* Konfirmasi akhir */}
            {page === 6 && (
                <>
                    <ConfirmAkhir
                        selectedDate={selectedDate}
                        customer={customer}
                        cats={catFormData ?? formList}
                        jastip={ringkasanJastip}
                    />
                    <div className="px-6 pb-44">
                        <button
                            onClick={() => setPage(5)}
                            className="bg-green-800 rounded-[20px] h-[50] hover:bg-green-900"
                        >
                            Previous
                        </button>
                    </div>
                </>
            )}
        </div>
    )
}