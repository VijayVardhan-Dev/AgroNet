import {
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Droplets,
  MapPin,
  RefreshCw,
  Sparkles,
  Sprout,
  ThermometerSun,
  Wind
} from 'lucide-react';

const TOTAL_SLIDES = 3;

const formatWeatherUpdatedAt = (updatedAt) => {
  if (!updatedAt) return 'Not updated yet';

  const diffMs = Date.now() - updatedAt;
  if (diffMs < 60 * 1000) return 'Updated just now';
  if (diffMs < 60 * 60 * 1000) return `Updated ${Math.floor(diffMs / (60 * 1000))}m ago`;
  if (diffMs < 24 * 60 * 60 * 1000) return `Updated ${Math.floor(diffMs / (60 * 60 * 1000))}h ago`;

  const date = new Date(updatedAt);
  return `Updated ${date.toLocaleDateString()}`;
};

const WeatherCard = ({
  weather,
  loadingWeather,
  isRefreshingWeather,
  weatherUpdatedAt,
  errorWeather,
  onRefreshWeather,
  compact
}) => {
  const showBlockingState = loadingWeather && !weather;
  const showBlockingError = errorWeather && !weather;
  const updatedLabel = formatWeatherUpdatedAt(weatherUpdatedAt);

  if (showBlockingState) {
    return (
      <div className="relative z-10">
        <div className="animate-pulse space-y-3">
          <div className="h-3 w-28 bg-white/25 rounded"></div>
          <div className="h-12 w-40 bg-white/25 rounded-lg"></div>
          <div className="h-3 w-36 bg-white/25 rounded"></div>
          <div className="grid grid-cols-3 gap-2 pt-1">
            <div className="h-10 rounded-lg bg-white/20"></div>
            <div className="h-10 rounded-lg bg-white/20"></div>
            <div className="h-10 rounded-lg bg-white/20"></div>
          </div>
        </div>
      </div>
    );
  }

  if (showBlockingError) {
    return (
      <div className="relative z-10 flex items-center gap-2 text-sm text-white/90">
        <AlertCircle className="w-4 h-4 shrink-0" /> {errorWeather}
      </div>
    );
  }

  if (!weather) {
    return <span className="relative z-10 text-sm text-white/85">Weather unavailable</span>;
  }

  return (
    <div className="relative z-10">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[11px] uppercase tracking-[0.18em] text-white/80">Live Weather</p>
          <p className="mt-1 inline-flex items-center gap-1.5 text-[11px] text-white/75">
            <Clock3 className="w-3 h-3" />
            {updatedLabel}
          </p>
        </div>

        <button
          onClick={onRefreshWeather}
          className="inline-flex items-center gap-1.5 rounded-lg bg-white/15 px-3 py-1.5 text-xs font-semibold hover:bg-white/25 transition-colors"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isRefreshingWeather ? 'animate-spin' : ''}`} />
          {isRefreshingWeather ? 'Updating' : 'Refresh'}
        </button>
      </div>

      <div className={`mt-4 ${compact ? 'flex items-center gap-3' : 'flex items-end justify-between gap-3'}`}>
        <div className="min-w-0">
          <p className="text-4xl md:text-5xl font-black leading-none">
            {Math.round(weather.current.temp_c)}
            <span className="text-lg font-semibold ml-1 text-white/80">deg C</span>
          </p>
          <p className="mt-1 text-sm md:text-base text-white/95 capitalize truncate">{weather.current.condition.text}</p>
          <p className="mt-2 inline-flex items-center gap-1.5 text-xs md:text-sm text-white/85 truncate">
            <MapPin className="w-3.5 h-3.5" />
            {weather.location.name}
          </p>
        </div>

        <div className="w-14 h-14 md:w-16 md:h-16 rounded-xl bg-white/15 backdrop-blur-sm ring-1 ring-white/20 flex items-center justify-center shrink-0">
          <img src={`https:${weather.current.condition.icon}`} alt="weather icon" className="w-12 h-12 md:w-14 md:h-14" />
        </div>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2">
        <div className="rounded-lg bg-white/12 backdrop-blur-sm px-2 py-2 text-xs">
          <p className="inline-flex items-center gap-1.5 text-white/80">
            <Droplets className="w-3.5 h-3.5" />
            Humidity
          </p>
          <p className="mt-1 text-white font-semibold">{weather.current.humidity}%</p>
        </div>
        <div className="rounded-lg bg-white/12 backdrop-blur-sm px-2 py-2 text-xs">
          <p className="inline-flex items-center gap-1.5 text-white/80">
            <Wind className="w-3.5 h-3.5" />
            Wind
          </p>
          <p className="mt-1 text-white font-semibold">{weather.current.wind_kph} km/h</p>
        </div>
        <div className="rounded-lg bg-white/12 backdrop-blur-sm px-2 py-2 text-xs">
          <p className="inline-flex items-center gap-1.5 text-white/80">
            <ThermometerSun className="w-3.5 h-3.5" />
            Feels
          </p>
          <p className="mt-1 text-white font-semibold">{Math.round(weather.current.feelslike_c)} deg C</p>
        </div>
      </div>

      {errorWeather && (
        <div className="mt-3 rounded-lg bg-amber-300/20 text-amber-100 px-3 py-2 text-xs inline-flex items-center gap-2">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          {errorWeather}
        </div>
      )}
    </div>
  );
};

const WeatherSlide = (props) => (
  <div className="w-full shrink-0 min-h-[218px] p-5 text-white relative overflow-hidden bg-gradient-to-br from-[#0B6B68] via-[#0C7873] to-[#125B95]">
    <div className="absolute -top-16 -right-12 w-44 h-44 rounded-full bg-white/15 blur-2xl"></div>
    <div className="absolute -bottom-20 -left-14 w-52 h-52 rounded-full bg-cyan-200/25 blur-3xl"></div>
    <div className="absolute top-4 right-4 text-white/25">
      <Sparkles className="w-5 h-5" />
    </div>
    <WeatherCard {...props} compact />
  </div>
);

const HighlightsSection = ({
  loadingWeather,
  isRefreshingWeather,
  weatherUpdatedAt,
  errorWeather,
  weather,
  onRefreshWeather,
  currentSlide,
  onSlideChange,
  promoImage
}) => {
  const goToNextSlide = () => {
    onSlideChange((currentSlide + 1) % TOTAL_SLIDES);
  };

  const goToPrevSlide = () => {
    onSlideChange((currentSlide - 1 + TOTAL_SLIDES) % TOTAL_SLIDES);
  };

  return (
    <>
      <div className="mt-8 md:hidden">
        <div className="relative w-full overflow-hidden rounded-2xl border border-slate-200/70 shadow-sm">
          <div
            className="flex transition-transform duration-700 ease-in-out"
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          >
            <WeatherSlide
              loadingWeather={loadingWeather}
              isRefreshingWeather={isRefreshingWeather}
              weatherUpdatedAt={weatherUpdatedAt}
              errorWeather={errorWeather}
              weather={weather}
              onRefreshWeather={onRefreshWeather}
            />

            <div className="w-full shrink-0 min-h-[218px] bg-gradient-to-br from-[#166534] via-[#15803D] to-[#22C55E] p-5 text-white">
              <p className="text-[11px] uppercase tracking-[0.18em] text-white/80">Government Scheme</p>
              <h3 className="mt-2 text-lg font-bold leading-tight">PM-KISAN Direct Benefit Transfer</h3>
              <p className="mt-2 text-sm text-white/85">Get Rs 6,000/year direct income support for farmers.</p>
              <button className="mt-5 inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-sm font-semibold text-emerald-800 shadow-sm hover:bg-emerald-50 transition-colors">
                <Sprout className="w-4 h-4" />
                Learn More
              </button>
            </div>

            <div className="w-full shrink-0 min-h-[218px] bg-gradient-to-br from-[#D9F99D] to-[#86EFAC] p-5 text-slate-900 relative overflow-hidden">
              <h3 className="max-w-[70%] text-lg font-bold leading-tight">Fresh foods everyday with trusted delivery</h3>
              <p className="mt-2 max-w-[66%] text-sm text-slate-700">Grab offers on your first bulk order this week.</p>
              <button className="mt-5 rounded-xl bg-slate-900 text-white px-4 py-2 text-sm font-semibold hover:bg-slate-800 transition-colors">
                Grab Voucher
              </button>
              <img
                src={promoImage}
                className="absolute -right-4 -bottom-2 w-[132px] h-[128px] object-contain rotate-[10deg] opacity-80"
                alt="Promo"
              />
            </div>
          </div>
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
            {[0, 1, 2].map((i) => (
              <button
                key={i}
                onClick={() => onSlideChange(i)}
                className={`transition-all duration-300 rounded-full ${currentSlide === i ? 'w-6 h-2 bg-white' : 'w-2 h-2 bg-white/60'}`}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="hidden md:block mt-8">
        <div className="relative h-[360px] overflow-hidden rounded-[34px] border border-slate-200/70 shadow-[0_20px_50px_rgba(15,23,42,0.16)]">
          <div
            className="flex h-full transition-transform duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)]"
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          >
            <div className="w-full h-full shrink-0 p-8 text-white relative overflow-hidden bg-gradient-to-br from-[#0B6B68] via-[#0C7873] to-[#125B95]">
              <div className="absolute -top-16 -right-10 w-48 h-48 rounded-full bg-white/15 blur-3xl"></div>
              <div className="absolute -bottom-24 left-1/3 w-72 h-72 rounded-full bg-cyan-200/20 blur-3xl"></div>
              <div className="relative z-10 grid grid-cols-[1.2fr_0.8fr] gap-8 h-full">
                <WeatherCard
                  loadingWeather={loadingWeather}
                  isRefreshingWeather={isRefreshingWeather}
                  weatherUpdatedAt={weatherUpdatedAt}
                  errorWeather={errorWeather}
                  weather={weather}
                  onRefreshWeather={onRefreshWeather}
                />
                <div className="self-center justify-self-end max-w-[280px] rounded-2xl bg-white/12 ring-1 ring-white/20 backdrop-blur-sm p-5">
                  <p className="text-[11px] uppercase tracking-[0.16em] text-white/75">Farm Advisory</p>
                  <h4 className="mt-2 text-xl font-bold leading-tight">Plan irrigation around humidity and wind trend.</h4>
                  <p className="mt-3 text-sm text-white/80">Use this panel as a quick daily snapshot before field activity.</p>
                </div>
              </div>
            </div>

            <div className="w-full h-full shrink-0 relative overflow-hidden bg-gradient-to-br from-[#166534] via-[#15803D] to-[#22C55E] p-8 text-white">
              <div className="absolute top-8 right-8 w-40 h-40 rounded-full border border-white/20"></div>
              <div className="absolute -bottom-20 -right-16 w-72 h-72 rounded-full bg-lime-300/20 blur-3xl"></div>
              <div className="relative z-10 h-full flex items-center justify-between gap-10">
                <div className="max-w-xl">
                  <p className="text-[12px] uppercase tracking-[0.2em] text-white/80">Government Scheme</p>
                  <h3 className="mt-3 text-4xl font-black leading-tight">PM-KISAN Direct Benefit Transfer</h3>
                  <p className="mt-4 text-base text-white/90">Eligible farmers can receive Rs 6,000 every year directly in their account.</p>
                  <button className="mt-7 inline-flex items-center gap-2 rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-emerald-800 shadow-sm hover:bg-emerald-50 transition-colors">
                    <Sprout className="w-4 h-4" />
                    Check Eligibility
                  </button>
                </div>
                <div className="max-w-[260px] rounded-2xl bg-black/15 border border-white/15 p-5">
                  <p className="text-sm text-white/85">Fast updates. Direct support. Farmer-first benefits with minimal paperwork.</p>
                </div>
              </div>
            </div>

            <div className="w-full h-full shrink-0 relative overflow-hidden bg-gradient-to-br from-[#D9F99D] via-[#A7F3D0] to-[#6EE7B7] p-8 text-slate-900">
              <div className="absolute -top-16 right-24 w-56 h-56 rounded-full bg-white/40 blur-3xl"></div>
              <div className="absolute -bottom-20 -left-12 w-72 h-72 rounded-full bg-emerald-400/20 blur-3xl"></div>
              <div className="relative z-10 h-full flex items-center">
                <div className="max-w-[56%]">
                  <p className="text-[12px] uppercase tracking-[0.16em] text-slate-700/80">Limited Offer</p>
                  <h3 className="mt-2 text-4xl font-black leading-tight">Fresh Foods. Better Service. Faster Delivery.</h3>
                  <p className="mt-4 text-base text-slate-700">Get up to 30% off on your first bulk order from verified local farmers.</p>
                  <button className="mt-7 rounded-xl bg-slate-900 text-white px-5 py-2.5 text-sm font-semibold hover:bg-slate-800 transition-colors">
                    Grab Voucher
                  </button>
                </div>
              </div>
              <img
                src={promoImage}
                className="absolute right-8 bottom-10 w-[300px] h-[220px] object-contain rotate-[7deg] opacity-90"
                alt="Promo"
              />
            </div>
          </div>

          <button
            onClick={goToPrevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/85 text-slate-700 shadow-md hover:bg-white transition-colors flex items-center justify-center"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <button
            onClick={goToNextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/85 text-slate-700 shadow-md hover:bg-white transition-colors flex items-center justify-center"
            aria-label="Next slide"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-2">
            {[0, 1, 2].map((i) => (
              <button
                key={i}
                onClick={() => onSlideChange(i)}
                className={`transition-all duration-300 rounded-full ${currentSlide === i ? 'w-8 h-2.5 bg-white' : 'w-2.5 h-2.5 bg-white/60'}`}
              />
            ))}
          </div>

          <div className="pointer-events-none absolute -bottom-14 left-1/2 -translate-x-1/2 w-[122%] h-24 rounded-[100%] bg-[radial-gradient(circle_at_top,_#ecf6ef_0%,_#f6f7f3_48%,_#f4f5f0_100%)] z-10"></div>
        </div>
      </div>
    </>
  );
};

export default HighlightsSection;
