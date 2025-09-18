"use client"

import { useState, useMemo } from "react"
import { Search, MapPin, Filter, Grid3X3, List, Navigation } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { motion, AnimatePresence } from "framer-motion"
import { AQIBadge } from "@/components/ui/aqi-badge"

interface Location {
  id: number
  name: string
  latitude: number
  longitude: number
  latest?: {
    aqi: number
    pm25?: number
    pm10?: number
    timestamp: string
  }
}

interface EnhancedAreaSelectorProps {
  locations: Location[]
  selectedLocation: number
  onLocationSelect: (locationId: number) => void
  className?: string
}

const areaCategories = {
  "Tech Hub": [
    "Whitefield", "Electronic City", "Marathahalli", "Bellandur", 
    "Sarjapur", "KR Puram", "Peenya", "Yeshwanthpur"
  ],
  "Central": [
    "MG Road", "Brigade Road", "Commercial Street", "Indiranagar", 
    "Domlur", "Ulsoor", "Cunningham Road"
  ],
  "Residential": [
    "Koramangala", "Jayanagar", "HSR Layout", "BTM Layout", 
    "Malleswaram", "Basavanagudi", "JP Nagar", "Banashankari", 
    "Rajajinagar", "Sadashivanagar", "RT Nagar", "Banaswadi"
  ],
  "Airport Area": [
    "Hebbal", "Yelahanka"
  ],
  "South": [
    "Begur", "JP Nagar", "Jayanagar", "Banashankari", "BTM Layout"
  ]
}

function getCategoryForArea(areaName: string): string {
  for (const [category, areas] of Object.entries(areaCategories)) {
    if (areas.includes(areaName)) {
      return category
    }
  }
  return "Other"
}

function getAQIColor(aqi: number): string {
  if (aqi <= 50) return "text-green-500"
  if (aqi <= 100) return "text-yellow-500"
  if (aqi <= 150) return "text-orange-500"
  if (aqi <= 200) return "text-red-500"
  return "text-purple-500"
}

export function EnhancedAreaSelector({
  locations,
  selectedLocation,
  onLocationSelect,
  className = ""
}: EnhancedAreaSelectorProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [sortBy, setSortBy] = useState("name")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")

  const filteredAndSortedLocations = useMemo(() => {
    let filtered = locations.filter(location => 
      location.name.toLowerCase().includes(searchTerm.toLowerCase())
    )

    if (selectedCategory !== "all") {
      filtered = filtered.filter(location => 
        getCategoryForArea(location.name) === selectedCategory
      )
    }

    return filtered.sort((a, b) => {
      switch (sortBy) {
        case "aqi":
          const aqiA = a.latest?.aqi || 0
          const aqiB = b.latest?.aqi || 0
          return aqiB - aqiA
        case "name":
        default:
          return a.name.localeCompare(b.name)
      }
    })
  }, [locations, searchTerm, selectedCategory, sortBy])

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {}
    locations.forEach(location => {
      const category = getCategoryForArea(location.name)
      counts[category] = (counts[category] || 0) + 1
    })
    return counts
  }, [locations])

  return (
    <Card className={`w-full ${className}`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Navigation className="h-5 w-5 text-primary" />
          Enhanced Area Selection
          <Badge variant="secondary" className="ml-auto">
            {locations.length} Areas Available
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search areas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-48">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {Object.entries(categoryCounts).map(([category, count]) => (
                <SelectItem key={category} value={category}>
                  {category} ({count})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name">Name</SelectItem>
              <SelectItem value="aqi">AQI Level</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex bg-muted rounded-lg p-1">
            <Button
              variant={viewMode === "grid" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("grid")}
            >
              <Grid3X3 className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("list")}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Category Overview */}
        <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="w-full">
          <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6">
            <TabsTrigger value="all" className="text-xs">All</TabsTrigger>
            {Object.entries(categoryCounts).slice(0, 5).map(([category, count]) => (
              <TabsTrigger key={category} value={category} className="text-xs">
                {category} ({count})
              </TabsTrigger>
            ))}
          </TabsList>

          {/* Location Grid/List View */}
          <div className="mt-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={`${viewMode}-${selectedCategory}-${searchTerm}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className={viewMode === "grid" 
                  ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3"
                  : "space-y-2"
                }
              >
                {filteredAndSortedLocations.map((location) => {
                  const isSelected = location.id === selectedLocation
                  const category = getCategoryForArea(location.name)
                  
                  return (
                    <motion.div
                      key={location.id}
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Card 
                        className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
                          isSelected 
                            ? "ring-2 ring-primary shadow-lg bg-primary/5" 
                            : "hover:bg-accent/50"
                        }`}
                        onClick={() => onLocationSelect(location.id)}
                      >
                        <CardContent className={viewMode === "grid" ? "p-4" : "p-3"}>
                          <div className={viewMode === "grid" ? "space-y-3" : "flex items-center justify-between"}>
                            <div className={viewMode === "list" ? "flex-1" : ""}>
                              <div className="flex items-start justify-between mb-2">
                                <h3 className={`font-medium ${viewMode === "grid" ? "text-sm" : "text-base"}`}>
                                  {location.name}
                                </h3>
                                {location.latest && (
                                  <AQIBadge aqi={location.latest.aqi} size="sm" />
                                )}
                              </div>
                              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <MapPin className="h-3 w-3" />
                                <Badge variant="outline" className="text-xs">
                                  {category}
                                </Badge>
                              </div>
                            </div>
                            
                            {viewMode === "grid" && location.latest && (
                              <div className="flex items-center justify-between text-xs">
                                <span className="text-muted-foreground">AQI:</span>
                                <span className={`font-semibold ${getAQIColor(location.latest.aqi)}`}>
                                  {Math.round(location.latest.aqi)}
                                </span>
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  )
                })}
              </motion.div>
            </AnimatePresence>

            {filteredAndSortedLocations.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <MapPin className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No areas found matching your criteria</p>
                <Button variant="outline" className="mt-2" onClick={() => {
                  setSearchTerm("")
                  setSelectedCategory("all")
                }}>
                  Clear Filters
                </Button>
              </div>
            )}
          </div>
        </Tabs>

        {/* Quick Stats */}
        <div className="flex flex-wrap gap-4 pt-4 border-t">
          <div className="text-sm text-muted-foreground">
            Showing {filteredAndSortedLocations.length} of {locations.length} areas
          </div>
          {locations.length > 0 && (
            <div className="text-sm text-muted-foreground">
              Average AQI: {Math.round(
                locations.reduce((sum, loc) => sum + (loc.latest?.aqi || 0), 0) / locations.length
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}