import { Host, TextInput as ExpoTextInput } from '@expo/ui';
import type { TextInputRef } from '@expo/ui';
import * as Haptics from 'expo-haptics';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import {
  ArrowDownWideNarrow,
  ArrowRight,
  CalendarDays,
  Check,
  Compass,
  Heart,
  MapPin,
  Search,
  Sparkles,
  Ticket,
  X,
} from 'lucide-react-native';
import { useMemo, useRef, useState } from 'react';
import {
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

type Concert = {
  id: string;
  title: string;
  genre: string;
  date: string;
  month: string;
  venue: string;
  city: string;
  price: number;
  image: string;
  tag?: string;
  description: string;
};

const concerts: Concert[] = [
  {
    id: 'midnight-frequency',
    title: 'MIDNIGHT\nFREQUENCY',
    genre: 'Electronic',
    date: '18 JUL 2026',
    month: 'JUL',
    venue: 'Jakarta International Stadium',
    city: 'Jakarta',
    price: 450000,
    image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=1400&q=85',
    tag: 'Z FEST PICK',
    description:
      'A night built for big sound, open skies, and the kind of energy that stays with you long after the final track.',
  },
  {
    id: 'afterglow',
    title: 'AFTERGLOW',
    genre: 'Electronic',
    date: '08 AUG 2026',
    month: 'AUG',
    venue: 'Beach City International Stadium',
    city: 'Jakarta',
    price: 375000,
    image: 'https://images.unsplash.com/photo-1506157786151-b8491531f063?auto=format&fit=crop&w=1000&q=85',
    tag: 'OPEN AIR',
    description:
      'Golden-hour sets roll into a late-night dance floor at this open-air celebration by the coast.',
  },
  {
    id: 'sound-of-the-city',
    title: 'SOUND OF\nTHE CITY',
    genre: 'Indie',
    date: '22 AUG 2026',
    month: 'AUG',
    venue: 'Senayan Park',
    city: 'Jakarta',
    price: 325000,
    image: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?auto=format&fit=crop&w=1000&q=85',
    description:
      'A showcase of independent voices, rising artists, and the sounds shaping the next wave.',
  },
  {
    id: 'rituals-live',
    title: 'RITUALS: LIVE',
    genre: 'Pop',
    date: '05 SEP 2026',
    month: 'SEP',
    venue: 'GBK Madya Stadium',
    city: 'Jakarta',
    price: 525000,
    image: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=1000&q=85',
    tag: 'LIMITED RUN',
    description:
      'An immersive live show with a full-scale stage, unexpected collaborations, and a setlist made for singing together.',
  },
];

const genres = ['All', 'Electronic', 'Indie', 'Pop'];
const months = ['ALL DATES', 'JUL', 'AUG', 'SEP'];
const formatPrice = (price: number) =>
  new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(price);

function hapticSelection() {
  if (Platform.OS !== 'web') {
    void Haptics.selectionAsync();
  }
}

export default function ExploreScreen() {
  const insets = useSafeAreaInsets();
  const searchRef = useRef<TextInputRef>(null);
  const [query, setQuery] = useState('');
  const [genreFilter, setGenreFilter] = useState('All');
  const [monthFilter, setMonthFilter] = useState('ALL DATES');
  const [favorites, setFavorites] = useState<string[]>([]);
  const [selectedConcert, setSelectedConcert] = useState<Concert | null>(null);

  const filteredConcerts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return concerts.filter((concert) => {
      const matchesQuery =
        !normalizedQuery ||
        `${concert.title} ${concert.genre} ${concert.venue} ${concert.city}`
          .toLowerCase()
          .includes(normalizedQuery);
      const matchesGenre = genreFilter === 'All' || concert.genre === genreFilter;
      const matchesMonth = monthFilter === 'ALL DATES' || concert.month === monthFilter;

      return matchesQuery && matchesGenre && matchesMonth;
    });
  }, [genreFilter, monthFilter, query]);

  const featuredConcert = filteredConcerts[0];
  const remainingConcerts = featuredConcert
    ? filteredConcerts.filter((concert) => concert.id !== featuredConcert.id)
    : [];

  function toggleFavorite(concertId: string) {
    hapticSelection();
    setFavorites((current) =>
      current.includes(concertId)
        ? current.filter((favoriteId) => favoriteId !== concertId)
        : [...current, concertId]
    );
  }

  function openConcert(concert: Concert) {
    hapticSelection();
    setSelectedConcert(concert);
  }

  return (
    <SafeAreaView className="flex-1 bg-[#0B0B0B]" edges={['top', 'left', 'right']}>
      <StatusBar style="light" />
      <ScrollView
        className="flex-1"
        contentContainerStyle={{
          alignItems: 'center',
          paddingHorizontal: 20,
          paddingTop: 16,
          paddingBottom: Math.max(insets.bottom + 104, 120),
        }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>
        <View className="w-full max-w-[640px]">
          <View className="mb-9 flex-row items-center justify-between">
            <View className="flex-row items-center">
              <View className="mr-2 h-7 w-7 items-center justify-center rounded-full bg-[#FBBF24]">
                <Text className="text-[15px] font-black text-[#0B0B0B]">Z</Text>
              </View>
              <Text className="text-[17px] font-black tracking-[1.5px] text-white">FEST</Text>
              <View className="ml-3 h-4 w-px bg-[#343434]" />
              <Text className="ml-3 text-[10px] font-bold tracking-[2px] text-[#A1A1AA]">
                DISCOVER
              </Text>
            </View>
            <View
              accessibilityLabel="Current city: Jakarta"
              accessible
              className="flex-row items-center rounded-full border border-[#303030] px-3 py-2">
              <MapPin color="#FBBF24" size={14} />
              <Text className="ml-1.5 text-[11px] font-semibold text-white">JAKARTA</Text>
            </View>
          </View>

          <Animated.View entering={FadeInDown.duration(420)}>
            <View className="mb-5">
              <Text className="mb-2 text-[10px] font-bold tracking-[3px] text-[#FBBF24]">
                FIND YOUR NEXT LIVE MOMENT
              </Text>
              <Text className="text-[38px] font-black leading-[42px] tracking-[-1.4px] text-white">
                THE NIGHT{'\n'}
                <Text className="text-[#FBBF24]">IS YOURS.</Text>
              </Text>
              <Text className="mt-3 max-w-[330px] text-[14px] leading-[21px] text-[#A1A1AA]">
                Find the sound, the crowd, and the nights you&apos;ll talk about.
              </Text>
            </View>

            <View className="mb-5 h-[50px] flex-row items-center rounded-xl border border-[#303030] bg-[#171717] px-3">
              <Search color="#A1A1AA" size={18} />
              <View className="ml-2.5 flex-1">
                <Host matchContents style={{ height: 44, width: '100%' }}>
                  <ExpoTextInput
                    ref={searchRef}
                    accessibilityLabel="Search concerts, genres, or venues"
                    defaultValue={query}
                    onChangeText={setQuery}
                    placeholder="Search concerts, artists, venues..."
                    placeholderTextColor="#71717A"
                    returnKeyType="search"
                    selectionColor="#FBBF24"
                    style={{
                      width: '100%',
                      height: 44,
                      paddingHorizontal: 0,
                      paddingVertical: 8,
                      backgroundColor: 'transparent',
                      borderWidth: 0,
                    }}
                    textStyle={{ color: '#FFFFFF', fontSize: 13 }}
                  />
                </Host>
              </View>
              {query ? (
                <Pressable
                  accessibilityLabel="Clear search"
                  accessibilityRole="button"
                  hitSlop={10}
                  onPress={() => {
                    setQuery('');
                    searchRef.current?.clear();
                  }}>
                  <X color="#A1A1AA" size={16} />
                </Pressable>
              ) : null}
            </View>
          </Animated.View>

          <View className="mb-5">
            <View className="mb-3 flex-row items-center justify-between">
              <Text className="text-[10px] font-bold tracking-[2px] text-[#A1A1AA]">
                EXPLORE BY SOUND
              </Text>
              <ArrowDownWideNarrow color="#A1A1AA" size={15} />
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {genres.map((genre) => {
                const isSelected = genreFilter === genre;
                return (
                  <Pressable
                    key={genre}
                    accessibilityRole="button"
                    accessibilityState={{ selected: isSelected }}
                    className={`mr-2 rounded-full border px-4 py-2 ${
                      isSelected
                        ? 'border-[#FBBF24] bg-[#FBBF24]'
                        : 'border-[#343434] bg-transparent'
                    }`}
                    onPress={() => {
                      hapticSelection();
                      setGenreFilter(genre);
                    }}>
                    <Text
                      className={`text-[12px] font-semibold ${
                        isSelected ? 'text-[#0B0B0B]' : 'text-[#D4D4D8]'
                      }`}>
                      {genre}
                    </Text>
                  </Pressable>
                );
              })}
            </ScrollView>
          </View>

          <View className="mb-7">
            <View className="mb-3 flex-row items-center justify-between">
              <Text className="text-[10px] font-bold tracking-[2px] text-[#A1A1AA]">
                WHEN ARE YOU GOING?
              </Text>
              <CalendarDays color="#A1A1AA" size={14} />
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {months.map((month) => {
                const isSelected = monthFilter === month;
                return (
                  <Pressable
                    key={month}
                    accessibilityRole="button"
                    accessibilityState={{ selected: isSelected }}
                    className={`mr-2 flex-row items-center rounded-full border px-3.5 py-2 ${
                      isSelected ? 'border-[#5B4816] bg-[#211C0D]' : 'border-[#303030]'
                    }`}
                    onPress={() => {
                      hapticSelection();
                      setMonthFilter(month);
                    }}>
                    {isSelected && <Check color="#FBBF24" size={12} />}
                    <Text
                      className={`text-[10px] font-bold tracking-[1px] ${
                        isSelected ? 'ml-1.5 text-[#FBBF24]' : 'text-[#A1A1AA]'
                      }`}>
                      {month}
                    </Text>
                  </Pressable>
                );
              })}
            </ScrollView>
          </View>

          {featuredConcert ? (
            <Animated.View entering={FadeInDown.duration(420).delay(80)}>
              <View className="mb-4 flex-row items-end justify-between">
                <View>
                  <Text className="mb-1 text-[10px] font-bold tracking-[2px] text-[#FBBF24]">
                    ON THE RADAR
                  </Text>
                  <Text className="text-[22px] font-extrabold tracking-[-0.5px] text-white">
                    Featured show
                  </Text>
                </View>
                <Text className="text-[11px] text-[#A1A1AA]">
                  {filteredConcerts.length.toString().padStart(2, '0')} SHOWS
                </Text>
              </View>

              <View className="mb-8 overflow-hidden rounded-2xl border border-[#282828] bg-[#171717]">
                <View className="h-[270px]">
                  <Image
                    accessibilityLabel="Live music crowd at a concert"
                    contentFit="cover"
                    source={{ uri: featuredConcert.image }}
                    style={StyleSheet.absoluteFill}
                    transition={300}
                  />
                  <LinearGradient
                    colors={['rgba(11,11,11,0.05)', 'rgba(11,11,11,0.18)', '#0B0B0B']}
                    locations={[0, 0.48, 1]}
                    style={StyleSheet.absoluteFill}
                  />
                  <Pressable
                    accessibilityLabel={`View ${featuredConcert.title.replace('\n', ' ')}`}
                    accessibilityRole="button"
                    className="absolute inset-0"
                    onPress={() => openConcert(featuredConcert)}>
                    <View className="absolute left-4 top-4 flex-row items-center rounded-full border border-white/15 bg-black/55 px-3 py-1.5">
                      <Sparkles color="#FBBF24" size={12} />
                      <Text className="ml-1.5 text-[9px] font-bold tracking-[1.5px] text-white">
                        {featuredConcert.tag ?? 'FEATURED'}
                      </Text>
                    </View>
                    <View className="absolute bottom-4 left-4 right-4">
                      <Text className="mb-1 text-[10px] font-bold tracking-[2px] text-[#FBBF24]">
                        {featuredConcert.genre.toUpperCase()} · {featuredConcert.date}
                      </Text>
                      <Text className="text-[30px] font-black leading-[31px] tracking-[-0.8px] text-white">
                        {featuredConcert.title}
                      </Text>
                      <View className="mt-3 flex-row items-center justify-between">
                        <View className="flex-row items-center">
                          <MapPin color="#A1A1AA" size={13} />
                          <Text className="ml-1.5 max-w-[220px] text-[11px] text-[#D4D4D8]">
                            {featuredConcert.venue}
                          </Text>
                        </View>
                        <ArrowRight color="#FBBF24" size={18} />
                      </View>
                    </View>
                  </Pressable>
                  <Pressable
                    accessibilityLabel={
                      favorites.includes(featuredConcert.id)
                        ? 'Remove featured concert from saved events'
                        : 'Save featured concert'
                    }
                    accessibilityRole="button"
                    className="absolute right-4 top-4 h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-black/55"
                    onPress={(event) => {
                      event.stopPropagation();
                      toggleFavorite(featuredConcert.id);
                    }}>
                    <Heart
                      color={favorites.includes(featuredConcert.id) ? '#FBBF24' : '#FFFFFF'}
                      fill={favorites.includes(featuredConcert.id) ? '#FBBF24' : 'transparent'}
                      size={17}
                    />
                  </Pressable>
                </View>
                <Pressable
                  accessibilityLabel={`View tickets for ${featuredConcert.title.replace('\n', ' ')}`}
                  accessibilityRole="button"
                  className="flex-row items-center justify-between border-t border-[#282828] px-4 py-3"
                  onPress={() => openConcert(featuredConcert)}>
                  <Text className="text-[10px] font-semibold tracking-[1px] text-[#A1A1AA]">
                    TICKETS FROM
                  </Text>
                  <Text className="text-[14px] font-bold text-white">
                    {formatPrice(featuredConcert.price)}
                  </Text>
                </Pressable>
              </View>
            </Animated.View>
          ) : (
            <View className="items-center rounded-2xl border border-[#282828] bg-[#171717] px-5 py-10">
              <Compass color="#FBBF24" size={25} />
              <Text className="mt-4 text-[17px] font-bold text-white">No shows found</Text>
              <Text className="mt-1 text-center text-[13px] leading-5 text-[#A1A1AA]">
                Try another search or clear a filter to discover more.
              </Text>
              <Pressable
                className="mt-4 rounded-full bg-[#FBBF24] px-4 py-2"
                onPress={() => {
                  setQuery('');
                  setGenreFilter('All');
                  setMonthFilter('ALL DATES');
                  searchRef.current?.clear();
                }}>
                <Text className="text-[11px] font-bold text-[#0B0B0B]">CLEAR FILTERS</Text>
              </Pressable>
            </View>
          )}

          {remainingConcerts.length > 0 ? (
            <View>
              <View className="mb-4 flex-row items-end justify-between">
                <View>
                  <Text className="mb-1 text-[10px] font-bold tracking-[2px] text-[#A1A1AA]">
                    MORE TO EXPERIENCE
                  </Text>
                  <Text className="text-[22px] font-extrabold tracking-[-0.5px] text-white">
                    Coming up
                  </Text>
                </View>
                <Pressable
                  accessibilityLabel="Show all upcoming concerts"
                  accessibilityRole="button"
                  className="flex-row items-center"
                  onPress={() => {
                    setGenreFilter('All');
                    setMonthFilter('ALL DATES');
                    setQuery('');
                    searchRef.current?.clear();
                  }}>
                  <Text className="mr-1 text-[11px] font-semibold text-[#FBBF24]">RESET</Text>
                  <ArrowRight color="#FBBF24" size={14} />
                </Pressable>
              </View>

              {remainingConcerts.map((concert, index) => {
                const isFavorite = favorites.includes(concert.id);
                return (
                  <Animated.View
                    key={concert.id}
                    entering={FadeInDown.duration(380).delay(120 + index * 65)}>
                    <View className="mb-3 flex-row overflow-hidden rounded-xl border border-[#282828] bg-[#171717]">
                      <Pressable
                        accessibilityLabel={`View ${concert.title.replace('\n', ' ')}`}
                        accessibilityRole="button"
                        className="flex-1 flex-row"
                        onPress={() => openConcert(concert)}>
                        <Image
                          accessibilityLabel={`${concert.genre} concert`}
                          contentFit="cover"
                          source={{ uri: concert.image }}
                          style={styles.listImage}
                          transition={250}
                        />
                        <View className="flex-1 justify-center px-3 py-3">
                          <View className="mb-1.5 flex-row items-center">
                            <Text className="text-[9px] font-bold tracking-[1.5px] text-[#FBBF24]">
                              {concert.date}
                            </Text>
                            <View className="mx-2 h-1 w-1 rounded-full bg-[#71717A]" />
                            <Text className="text-[9px] font-semibold text-[#A1A1AA]">
                              {concert.genre.toUpperCase()}
                            </Text>
                          </View>
                          <Text
                            className="text-[17px] font-extrabold leading-[20px] text-white"
                            numberOfLines={2}>
                            {concert.title.replace('\n', ' ')}
                          </Text>
                          <View className="mt-1.5 flex-row items-center">
                            <MapPin color="#71717A" size={11} />
                            <Text className="ml-1 text-[10px] text-[#A1A1AA]" numberOfLines={1}>
                              {concert.venue}
                            </Text>
                          </View>
                          <View className="mt-2.5 flex-row items-center justify-between">
                            <Text className="text-[12px] font-bold text-white">
                              {formatPrice(concert.price)}
                            </Text>
                            {concert.tag ? (
                              <Text className="text-[8px] font-bold tracking-[1px] text-[#A1A1AA]">
                                {concert.tag}
                              </Text>
                            ) : null}
                          </View>
                        </View>
                      </Pressable>
                      <Pressable
                        accessibilityLabel={
                          isFavorite ? `Unsave ${concert.title}` : `Save ${concert.title}`
                        }
                        accessibilityRole="button"
                        className="absolute right-3 top-3 h-8 w-8 items-center justify-center rounded-full bg-black/55"
                        hitSlop={6}
                        onPress={(event) => {
                          event.stopPropagation();
                          toggleFavorite(concert.id);
                        }}>
                        <Heart
                          color={isFavorite ? '#FBBF24' : '#FFFFFF'}
                          fill={isFavorite ? '#FBBF24' : 'transparent'}
                          size={15}
                        />
                      </Pressable>
                    </View>
                  </Animated.View>
                );
              })}
            </View>
          ) : null}

          <View className="mt-5 flex-row items-center justify-center">
            <Ticket color="#71717A" size={13} />
            <Text className="ml-1.5 text-[10px] text-[#71717A]">
              Preview lineup · event details are sample listings
            </Text>
          </View>
        </View>
      </ScrollView>

      <Modal
        animationType="slide"
        onRequestClose={() => setSelectedConcert(null)}
        transparent
        visible={selectedConcert !== null}>
        <View className="flex-1 justify-end bg-black/75">
          <Pressable
            accessibilityLabel="Dismiss event preview"
            accessibilityRole="button"
            className="flex-1"
            onPress={() => setSelectedConcert(null)}
          />
          {selectedConcert ? (
            <View
              className="overflow-hidden rounded-t-[26px] border-t border-[#383838] bg-[#171717]"
              style={{ maxHeight: '90%', paddingBottom: Math.max(insets.bottom, 18) }}>
              <ScrollView
                contentContainerStyle={{ flexGrow: 0 }}
                showsVerticalScrollIndicator={false}
                style={{ flexShrink: 1 }}>
                <View className="h-[200px]">
                  <Image
                    accessibilityLabel="Concert preview"
                    contentFit="cover"
                    source={{ uri: selectedConcert.image }}
                    style={StyleSheet.absoluteFill}
                    transition={250}
                  />
                  <LinearGradient
                    colors={['rgba(11,11,11,0.05)', 'rgba(23,23,23,0.95)']}
                    style={StyleSheet.absoluteFill}
                  />
                  <Pressable
                    accessibilityLabel="Close event details"
                    accessibilityRole="button"
                    className="absolute right-5 top-5 h-9 w-9 items-center justify-center rounded-full bg-black/60"
                    onPress={() => setSelectedConcert(null)}>
                    <X color="#FFFFFF" size={17} />
                  </Pressable>
                  <View className="absolute bottom-4 left-5 right-5">
                    <Text className="text-[10px] font-bold tracking-[2px] text-[#FBBF24]">
                      {selectedConcert.genre.toUpperCase()} · {selectedConcert.date}
                    </Text>
                    <Text className="mt-1 text-[27px] font-black leading-[30px] text-white">
                      {selectedConcert.title}
                    </Text>
                  </View>
                </View>
                <View className="px-5 pb-3 pt-2">
                  <Text className="text-[13px] leading-[20px] text-[#A1A1AA]">
                    {selectedConcert.description}
                  </Text>
                  <View className="mt-4 flex-row items-center border-t border-[#303030] py-4">
                    <MapPin color="#FBBF24" size={16} />
                    <View className="ml-3 flex-1">
                      <Text className="text-[10px] font-bold tracking-[1.5px] text-[#A1A1AA]">
                        VENUE
                      </Text>
                      <Text className="mt-1 text-[13px] font-semibold text-white">
                        {selectedConcert.venue}
                      </Text>
                    </View>
                  </View>
                  <View className="flex-row items-center justify-between border-t border-[#303030] py-3">
                    <Text className="text-[11px] font-semibold tracking-[1px] text-[#A1A1AA]">
                      TICKETS FROM
                    </Text>
                    <Text className="text-[16px] font-bold text-white">
                      {formatPrice(selectedConcert.price)}
                    </Text>
                  </View>
                  <Pressable
                    accessibilityRole="button"
                    className={`mt-2 h-[50px] flex-row items-center justify-center rounded-xl ${
                      favorites.includes(selectedConcert.id)
                        ? 'border border-[#FBBF24]'
                        : 'bg-[#FBBF24]'
                    }`}
                    onPress={() => toggleFavorite(selectedConcert.id)}>
                    <Heart
                      color={favorites.includes(selectedConcert.id) ? '#FBBF24' : '#0B0B0B'}
                      fill={favorites.includes(selectedConcert.id) ? '#FBBF24' : 'transparent'}
                      size={17}
                    />
                    <Text
                      className={`ml-2 text-[12px] font-extrabold tracking-[1px] ${
                        favorites.includes(selectedConcert.id)
                          ? 'text-[#FBBF24]'
                          : 'text-[#0B0B0B]'
                      }`}>
                      {favorites.includes(selectedConcert.id)
                        ? 'SAVED TO YOUR LIST'
                        : 'SAVE THIS EVENT'}
                    </Text>
                  </Pressable>
                </View>
              </ScrollView>
            </View>
          ) : null}
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  listImage: {
    width: 112,
    minHeight: 140,
    backgroundColor: '#242424',
  },
});