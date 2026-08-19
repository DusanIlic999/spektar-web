import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function OAuthSuccess() {
  // useSearchParams je kuka iz react-router-dom koja lako čita parametre iz URL-a
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    // 1. Izvlačimo parametre koje nam je NestJS poslao u URL-u
    const token = searchParams.get("token");
    const email = searchParams.get("email");

    // 2. Proveravamo da li token uopšte postoji
    if (token) {
      // Uspešna prijava: Čuvamo token u localStorage za buduće API zahteve
      localStorage.setItem("token", token);

      // Ako ti zatreba i email odmah na frontendu, možeš i njega sačuvati
      if (email) {
        localStorage.setItem("user_email", email);
      }

      console.log("Prijava uspešna! Token je sačuvan.");

      // 3. Preusmeravamo korisnika na dashboard (glavnu stranicu)
      // { replace: true } briše ovu login-uspeh stranicu iz istorije brauzera
      // tako da korisnik ne može klikom na dugme "Nazad" da se vrati ovde.
      navigate("/", { replace: true });
    } else {
      // Greška: Ako nema tokena u URL-u, vrati korisnika na login stranicu
      console.error("Token nije pronađen u URL-u.");
      navigate("/", { replace: true });
    }
  }, [searchParams, navigate]);

  // Dok useEffect radi proveru i preusmeravanje (što traje milisekundu),
  // korisniku prikazujemo jednostavan uvodni ekran ili spiner.
  return (
    <div className="flex flex-col justify-center items-center h-screen bg-black/80">
      <div className="w-[40px] h-[40px] border-4 border-white/15 rounded-[50%] animate-spin"></div>
      <h2 className="text-white mt-[20px] ml-[5px]">Autorizacija uspešna...</h2>
      <p className="text-gray-700 m-0">Preusmeravamo vas na aplikaciju.</p>
    </div>
  );
}
