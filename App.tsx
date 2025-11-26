
import React, { useState, useEffect, useMemo } from "react";
import StoreSection from "./components/HomeSection";
import AudioPlayer from "./components/AboutSection";
import ShoppingCartComponent from "./components/ProjectsSection";
import Card from "./components/ContactSection";
import CheckoutPage from "./components/CheckoutPage";
import Header from "./components/Header";
import DownloadGateModal from "./components/DownloadGateModal";
import Footer from "./components/Footer";
import DrumKitsSection from "./components/DrumKitsSection";
import AdminPanel from './components/AdminPanel';
import LoginPage from './components/LoginPage';
import { useToast } from "./components/ToastProvider";
import { FileText, Download, Users, Sparkles, SearchIcon, X, Play, LayersIcon } from "./components/icons";
import LicenseAgreementModal from './components/LicenseAgreementModal';
import AboutPage from "./components/AboutPage";
import PricingPage from "./components/PricingPage";
import ProducersPage from "./components/ProducersPage";


// Type definitions
export interface Beat {
  id: string;
  producerId: string;
  created_at?: string;
  title: string;
  producer: string;
  bpm: number;
  key: string;
  duration: string;
  price_mp3: number;
  price_wav: number;
  price_stems: number;
  description?: string;
  audioPreviewUrl: string;
  downloadUrl: string; // This is the tagged MP3
  wavUrl: string | null;
  stemsUrl: string | null;
  artworkUrl: string;
  tags: string[];
}

export interface DrumKit {
  id: string;
  created_at?: string;
  title: string;
  description: string;
  price: number;
  download_url: string;
  artworkUrl: string;
}

export interface CartItem {
  id: string; // Composite key: `productType-productId-licenseType?`
  productId: string;
  type: 'beat' | 'drum_kit';
  title: string;
  price: number;
  description: string; // For beats: license name, for kits: "Drum Kit"
}

export type SocialLinks = {
  youtube: string;
  tiktok: string;
  instagram: string;
  spotify: string;
  twitter?: string;
};

export interface Producer {
  id: string;
  name: string;
  bio: string;
  avatarUrl: string;
  socials: Partial<SocialLinks>;
}

export interface AdminSettings {
    whatsappNumber: string;
    pixKey: string;
    adminUser: string;
    adminPass: string; // In a real app, this should be hashed. keeping simple for local demo.
}

export type View = 'store' | 'drum_kits' | 'checkout' | 'admin' | 'about' | 'pricing' | 'producers';

export type LicenseType = 'mp3' | 'wav' | 'stems';
export interface LicenseOption {
    type: LicenseType;
    name: string;
    price: number;
    description: string;
}

// --- MOCK DATA (Initial Defaults) ---
// Note: Artwork URLs are now often auto-generated placeholders based on requirements.
const mockBeats: Beat[] = [
  {
    id: '1',
    producerId: 'p1',
    title: 'DIAMOND DREAMS',
    producer: 'RMX',
    bpm: 142,
    key: 'C MINOR',
    duration: '02:55',
    price_mp3: 49.90,
    price_wav: 99.9,
    price_stems: 199.9,
    audioPreviewUrl: 'https://storage.googleapis.com/prod.creatorapp.ai/155b5505-35a3-4a69-8517-63b21655180f/01-audio.mp3',
    downloadUrl: 'https://storage.googleapis.com/prod.creatorapp.ai/155b5505-35a3-4a69-8517-63b21655180f/01-audio.mp3',
    wavUrl: 'https://storage.googleapis.com/prod.creatorapp.ai/155b5505-35a3-4a69-8517-63b21655180f/01-audio.wav',
    stemsUrl: 'https://storage.googleapis.com/prod.creatorapp.ai/155b5505-35a3-4a69-8517-63b21655180f/stems.zip',
    artworkUrl: 'https://placehold.co/400x400/1e1b4b/ffffff?text=DIAMOND',
    tags: ['Trap', 'Dark', 'Aggressive'],
  },
  {
    id: '2',
    producerId: 'p3',
    title: 'FUTURE VIBE',
    producer: 'Lo-Fi Ghost',
    bpm: 128,
    key: 'D# MINOR',
    duration: '03:10',
    price_mp3: 59.90,
    price_wav: 109.9,
    price_stems: 0,
    audioPreviewUrl: 'https://storage.googleapis.com/prod.creatorapp.ai/5107d3b9-1d21-4607-b33c-33b0067a996c/01-audio.mp3',
    downloadUrl: 'https://storage.googleapis.com/prod.creatorapp.ai/5107d3b9-1d21-4607-b33c-33b0067a996c/01-audio.mp3',
    wavUrl: 'https://storage.googleapis.com/prod.creatorapp.ai/5107d3b9-1d21-4607-b33c-33b0067a996c/01-audio.wav',
    stemsUrl: null,
    artworkUrl: 'https://placehold.co/400x400/1e1b4b/ffffff?text=FUTURE',
    tags: ['R&B', 'Chill', 'Smooth'],
  },
  {
    id: '3',
    producerId: 'p2',
    title: 'MEMÓRIAS',
    producer: 'Synth Samurai',
    bpm: 144,
    key: 'D MAJOR',
    duration: '02:45',
    price_mp3: 69.90,
    price_wav: 119.9,
    price_stems: 219.9,
    audioPreviewUrl: 'https://storage.googleapis.com/prod.creatorapp.ai/8208f51a-bf41-4770-85ce-a51187c3e414/01-audio.mp3',
    downloadUrl: 'https://storage.googleapis.com/prod.creatorapp.ai/8208f51a-bf41-4770-85ce-a51187c3e414/01-audio.mp3',
    wavUrl: null,
    stemsUrl: null,
    artworkUrl: 'https://placehold.co/400x400/1e1b4b/ffffff?text=MEMÓRIAS',
    tags: ['Lofi', 'Synthwave', 'Retro'],
  },
   {
    id: '4',
    producerId: 'p1',
    title: 'GEM TRAP',
    producer: 'RMX',
    bpm: 145,
    key: 'A MINOR',
    duration: '03:02',
    price_mp3: 54.90,
    price_wav: 99.9,
    price_stems: 199.9,
    audioPreviewUrl: 'https://storage.googleapis.com/prod.creatorapp.ai/155b5505-35a3-4a69-8517-63b21655180f/01-audio.mp3',
    downloadUrl: 'https://storage.googleapis.com/prod.creatorapp.ai/155b5505-35a3-4a69-8517-63b21655180f/01-audio.mp3',
    wavUrl: 'https://storage.googleapis.com/prod.creatorapp.ai/155b5505-35a3-4a69-8517-63b21655180f/01-audio.wav',
    stemsUrl: 'https://storage.googleapis.com/prod.creatorapp.ai/155b5505-35a3-4a69-8517-63b21655180f/stems.zip',
    artworkUrl: 'https://placehold.co/400x400/1e1b4b/ffffff?text=GEM',
    tags: ['Hip-Hop', 'Boom Bap', '90s'],
  },
];


const mockDrumKits: DrumKit[] = [
    // Updated color from Blue (1d4ed8) to Dark Green (064e3b) to match Sci-Fi theme
    { id: 'dk1', title: 'Essential Trap Kit Vol. 1', description: '150+ sons de alta qualidade para produção de trap moderno.', price: 79.90, download_url: '', artworkUrl: 'https://placehold.co/400x400/064e3b/4ade80?text=TRAP+KIT' },
];

const mockProducers: Producer[] = [
    {
        id: 'p1',
        name: 'RMX',
        bio: 'CEO & Produtor Principal. Especialista em Trap e Hip-Hop.',
        avatarUrl: 'https://placehold.co/200x200/064e3b/4ade80?text=RMX',
        socials: { instagram: '#', twitter: '#' }
    }
]

const mockSocialLinks: SocialLinks = {
    youtube: 'https://youtube.com',
    tiktok: 'https://tiktok.com',
    instagram: 'https://instagram.com',
    spotify: 'https://spotify.com'
};

const defaultSettings: AdminSettings = {
    whatsappNumber: '',
    pixKey: '',
    adminUser: 'admin',
    adminPass: 'password'
};

const LicenseSelectionModal: React.FC<{
    beat: Beat;
    options: LicenseOption[];
    onClose: () => void;
    onAddToCart: (beat: Beat, license: LicenseOption) => void;
    onViewLicenseTerms: (license: LicenseOption) => void;
}> = ({ beat, options, onClose, onAddToCart, onViewLicenseTerms }) => {
    return (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-[60] flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-black border border-green-900/50 shadow-[0_0_30px_rgba(34,197,94,0.1)] p-8 rounded-sm w-full max-w-lg relative animate-fade-in-up" onClick={e => e.stopPropagation()}>
                <button onClick={onClose} className="absolute top-4 right-4 text-green-700 hover:text-green-400"><X className="w-6 h-6"/></button>
                <h2 className="text-xl font-bold text-green-400 mb-2 font-mono uppercase tracking-widest">[LICENSE.SELECT]</h2>
                <p className="text-green-800 text-xs font-mono uppercase tracking-wide mb-6">TARGET: "{beat.title}"</p>
                <div className="space-y-4">
                    {options.map(opt => (
                        <div key={opt.type} className="bg-green-900/10 border border-green-900/30 hover:border-green-500/50 p-4 rounded-sm flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all">
                            <div>
                                <h3 className="font-bold text-green-400 text-sm font-mono uppercase tracking-wide">{opt.name}</h3>
                                <p className="text-[10px] text-green-700 font-mono uppercase mt-1">{opt.description}</p>
                            </div>
                            <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3 flex-shrink-0">
                                <span className="font-bold text-green-400 font-mono">R$ {opt.price.toFixed(2)}</span>
                                <button onClick={() => onViewLicenseTerms(opt)} className="text-[10px] text-green-600 hover:text-green-300 font-mono underline uppercase">TERMOS</button>
                                <button onClick={() => onAddToCart(beat, opt)} className="bg-green-700 hover:bg-green-500 text-black font-bold font-mono uppercase text-xs py-2 px-4 rounded-sm transition-colors shadow-lg shadow-green-900/20">
                                    Adicionar
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};


const App = () => {
    const { addToast } = useToast();

    // Data Initialization from LocalStorage or Default
    const [beats, setBeats] = useState<Beat[]>(() => {
        const saved = localStorage.getItem('rmx_beats');
        return saved ? JSON.parse(saved) : mockBeats;
    });

    const [drumKits, setDrumKits] = useState<DrumKit[]>(() => {
         const saved = localStorage.getItem('rmx_kits');
         return saved ? JSON.parse(saved) : mockDrumKits;
    });
    
    // Producers aren't currently managed in admin, just mock data
    const producers = mockProducers;

    const [socialLinks, setSocialLinks] = useState<SocialLinks>(() => {
        const saved = localStorage.getItem('rmx_socials');
        return saved ? JSON.parse(saved) : mockSocialLinks;
    });

    const [adminSettings, setAdminSettings] = useState<AdminSettings>(() => {
        const saved = localStorage.getItem('rmx_settings');
        return saved ? JSON.parse(saved) : defaultSettings;
    });

    // Save to LocalStorage whenever data changes
    useEffect(() => { localStorage.setItem('rmx_beats', JSON.stringify(beats)); }, [beats]);
    useEffect(() => { localStorage.setItem('rmx_kits', JSON.stringify(drumKits)); }, [drumKits]);
    useEffect(() => { localStorage.setItem('rmx_socials', JSON.stringify(socialLinks)); }, [socialLinks]);
    useEffect(() => { localStorage.setItem('rmx_settings', JSON.stringify(adminSettings)); }, [adminSettings]);


    // App State
    const [view, setView] = useState<View>('store');
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [currentBeat, setCurrentBeat] = useState<Beat | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isLooping, setIsLooping] = useState(false);
    const [currentPlayingList, setCurrentPlayingList] = useState<Beat[]>(beats);
    const [beatToDownload, setBeatToDownload] = useState<Beat | null>(null);
    const [isDownloadGateOpen, setIsDownloadGateOpen] = useState(false);
    const [licenseModalInfo, setLicenseModalInfo] = useState<{beat: Beat, options: LicenseOption[]} | null>(null);
    const [licenseTermsInfo, setLicenseTermsInfo] = useState<{beat: Beat, license: LicenseOption} | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    
     // State for filters
    const [searchTerm, setSearchTerm] = useState('');

     const filteredBeats = useMemo(() => {
        return beats.filter(beat => 
            beat.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            beat.producer.toLowerCase().includes(searchTerm.toLowerCase()) || 
            beat.tags.some(t => t.toLowerCase().includes(searchTerm.toLowerCase()))
        );
    }, [beats, searchTerm]);

    // Handlers
    const handleNavigate = (newView: View) => {
        setView(newView);
        window.scrollTo(0, 0);
    };

    const handleLogin = (user: string, pass: string) => {
        if (user === adminSettings.adminUser && pass === adminSettings.adminPass) {
            setIsAuthenticated(true);
            setView('admin');
            addToast('Login bem-sucedido!', 'success');
        } else {
            addToast('Usuário ou senha inválidos.', 'error');
        }
    };
    
    const handleLogout = () => {
        setIsAuthenticated(false);
        setView('store');
        addToast('Você saiu.', 'info');
    };

    const handlePlayBeat = (beatId: string) => {
        const beatToPlay = beats.find(b => b.id === beatId);
        if (beatToPlay) {
            if (currentBeat?.id === beatId) {
                setIsPlaying(!isPlaying); // Toggle play/pause
            } else {
                setCurrentPlayingList(filteredBeats);
                setCurrentBeat(beatToPlay);
                setIsPlaying(true);
            }
        }
    };
    
    const handlePlayPause = () => setIsPlaying(!isPlaying);

    const playNext = () => {
        if (!currentBeat) return;
        const currentIndex = currentPlayingList.findIndex(b => b.id === currentBeat.id);
        const nextIndex = (currentIndex + 1) % currentPlayingList.length;
        const nextBeat = currentPlayingList[nextIndex];
        setCurrentBeat(nextBeat);
        setIsPlaying(true);
    };

    const playPrevious = () => {
        if (!currentBeat) return;
        const currentIndex = currentPlayingList.findIndex(b => b.id === currentBeat.id);
        const prevIndex = (currentIndex - 1 + currentPlayingList.length) % currentPlayingList.length;
        const prevBeat = currentPlayingList[prevIndex];
        setCurrentBeat(prevBeat);
        setIsPlaying(true);
    };

    const handleAddToCartClick = (beat: Beat) => {
        const options: LicenseOption[] = [];
        if (beat.price_mp3 > 0) options.push({type: 'mp3', name: 'Licença Básica (MP3)', price: beat.price_mp3, description: 'Arquivo MP3 com tag.'});
        if (beat.price_wav > 0) options.push({type: 'wav', name: 'Licença Premium (WAV)', price: beat.price_wav, description: 'Arquivo WAV sem tag.'});
        if (beat.price_stems > 0) options.push({type: 'stems', name: 'Licença Stems (WAV)', price: beat.price_stems, description: 'Arquivos de track stems individuais.'});

        if (options.length > 0) {
            setLicenseModalInfo({ beat, options });
        } else {
             // Fallback for free beats logic if clicked on cart
             setBeatToDownload(beat);
             setIsDownloadGateOpen(true);
        }
    };

    const handleDownloadClick = (beat: Beat) => {
        setBeatToDownload(beat);
        setIsDownloadGateOpen(true);
    };

    const handleAddToCart = (item: Beat | DrumKit, license?: LicenseOption) => {
        const alreadyInCart = cartItems.some(cartItem => cartItem.id === (license ? `beat-${item.id}-${license.type}` : `drum_kit-${item.id}`));
        if (alreadyInCart) {
            addToast('Este item já está no seu carrinho.', 'info');
            return;
        }

        let newItem: CartItem;
        if ('bpm' in item && license) { // It's a Beat
            newItem = {
                id: `beat-${item.id}-${license.type}`,
                productId: item.id,
                type: 'beat',
                title: item.title,
                price: license.price,
                description: license.name,
            };
        } else { // It's a Drum Kit
            newItem = {
                id: `drum_kit-${item.id}`,
                productId: item.id,
                type: 'drum_kit',
                title: item.title,
                price: (item as DrumKit).price,
                description: 'Drum Kit',
            };
        }
        
        setCartItems(prev => [...prev, newItem]);
        addToast(`${item.title} adicionado ao carrinho!`, 'success');
        setLicenseModalInfo(null);
        setIsCartOpen(true);
    };
    
    const handleRemoveFromCart = (itemId: string) => {
        setCartItems(prev => prev.filter(item => item.id !== itemId));
        addToast('Item removido do carrinho.', 'success');
    };

    const handleCheckout = () => {
        setIsCartOpen(false);
        setView('checkout');
    };

    const handleConfirmPurchase = () => {
        addToast('Pedido enviado via WhatsApp! Aguarde nossa confirmação.', 'success');
        setCartItems([]);
        setView('store');
    };

    // Admin Panel Handlers
    const handleAddBeat = (newBeat: Beat) => { setBeats(prev => [newBeat, ...prev]); addToast('Beat adicionado e salvo!', 'success'); };
    const handleUpdateBeat = (beatId: string, data: Partial<Beat>) => { setBeats(prev => prev.map(b => b.id === beatId ? {...b, ...data} : b)); addToast('Beat atualizado!', 'success'); };
    const handleDeleteBeat = (beatToDelete: Beat) => { setBeats(prev => prev.filter(b => b.id !== beatToDelete.id)); addToast('Beat excluído!', 'success'); };
    const handleAddDrumKit = (newKit: DrumKit) => { setDrumKits(prev => [newKit, ...prev]); addToast('Drum kit adicionado e salvo!', 'success'); };
    const handleDeleteDrumKit = (kitToDelete: DrumKit) => { setDrumKits(prev => prev.filter(k => k.id !== kitToDelete.id)); addToast('Drum kit excluído!', 'success'); };
    const handleUpdateSocials = (newLinks: SocialLinks) => { setSocialLinks(newLinks); addToast('Links salvos!', 'success'); };
    const handleUpdateSettings = (newSettings: AdminSettings) => { setAdminSettings(newSettings); addToast('Configurações salvas!', 'success'); };


    const renderView = () => {
        if (!isAuthenticated && view === 'admin') {
            return <LoginPage onLogin={handleLogin} />;
        }

        switch(view) {
            case 'store':
                return <StoreSection 
                            beats={filteredBeats}
                            onPlayBeat={handlePlayBeat}
                            currentBeat={currentBeat} 
                            isPlaying={isPlaying} 
                            onAddToCartClick={handleAddToCartClick}
                            onDownloadClick={handleDownloadClick}
                            searchTerm={searchTerm}
                            onSearch={setSearchTerm}
                            socialLinks={socialLinks}
                        />;
            case 'drum_kits':
                return <DrumKitsSection drumKits={drumKits} onAddToCart={handleAddToCart} />;
            case 'checkout':
                return <CheckoutPage items={cartItems} settings={adminSettings} onConfirmPurchase={handleConfirmPurchase} onBackToStore={() => setView('store')} />;
            case 'admin':
                return <AdminPanel 
                            beats={beats} 
                            drumKits={drumKits} 
                            socialLinks={socialLinks} 
                            settings={adminSettings}
                            onAddBeat={handleAddBeat} 
                            onUpdateBeat={handleUpdateBeat} 
                            onDeleteBeat={handleDeleteBeat} 
                            onAddDrumKit={handleAddDrumKit} 
                            onDeleteDrumKit={handleDeleteDrumKit} 
                            onUpdateSocialLinks={handleUpdateSocials} 
                            onUpdateSettings={handleUpdateSettings}
                            onLogout={handleLogout} 
                        />;
            case 'about':
                return <AboutPage />;
            case 'pricing':
                return <PricingPage />;
             case 'producers':
                return <ProducersPage producers={producers} beats={beats} onFilterByProducer={(name) => { setSearchTerm(name); setView('store'); }} />;
            default:
                return <StoreSection 
                           beats={filteredBeats}
                           onPlayBeat={handlePlayBeat}
                           currentBeat={currentBeat} 
                           isPlaying={isPlaying} 
                           onAddToCartClick={handleAddToCartClick}
                           onDownloadClick={handleDownloadClick}
                           searchTerm={searchTerm}
                           onSearch={setSearchTerm}
                           socialLinks={socialLinks}
                        />;
        }
    };
    
    return (
        <div className="bg-black text-slate-300 min-h-screen font-sans flex flex-col">
            <Header onNavigate={handleNavigate} onSearch={setSearchTerm} />
            <main className="pt-24 pb-28 flex-grow">
                 {renderView()}
            </main>
            <Footer onAdminClick={() => setView('admin')} />
            <ShoppingCartComponent items={cartItems} onRemoveItem={handleRemoveFromCart} onCheckout={handleCheckout} isOpen={isCartOpen} setIsOpen={setIsCartOpen} onNavigate={handleNavigate}/>
            <AudioPlayer currentBeat={currentBeat} isPlaying={isPlaying} onPlayPause={handlePlayPause} onNext={playNext} onPrevious={playPrevious} isLooping={isLooping} onToggleLoop={() => setIsLooping(!isLooping)} />
            {licenseModalInfo && <LicenseSelectionModal beat={licenseModalInfo.beat} options={licenseModalInfo.options} onClose={() => setLicenseModalInfo(null)} onAddToCart={handleAddToCart} onViewLicenseTerms={(license) => setLicenseTermsInfo({beat: licenseModalInfo.beat, license})} />}
            {licenseTermsInfo && <LicenseAgreementModal beat={licenseTermsInfo.beat} license={licenseTermsInfo.license} onClose={() => setLicenseTermsInfo(null)} />}
            <DownloadGateModal isOpen={isDownloadGateOpen} onClose={() => setIsDownloadGateOpen(false)} beat={beatToDownload} socialLinks={socialLinks} />
        </div>
    );
};

export default App;
