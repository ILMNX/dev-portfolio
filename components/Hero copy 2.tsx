"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { FiArrowRight, FiMail } from "react-icons/fi"

interface Character {
  x: number
  y: number
  velocityX: number
  velocityY: number
  isGrounded: boolean
  facingRight: boolean
  isWalking: boolean
  isJumping: boolean
  isShooting: boolean
  jumpCount: number
}

interface Platform {
  x: number
  y: number
  width: number
  height: number
  element: HTMLElement
  destructible: boolean
}

interface Bullet {
  id: string
  x: number
  y: number
  velocityX: number
  velocityY: number
  direction: number
}

// Improved pixelated character component
const PixelCharacter = ({ 
  selectedCharacter, 
  isWalking, 
  isJumping, 
  isShooting, 
  facingRight 
}: {
  selectedCharacter: 'boy' | 'girl'
  isWalking: boolean
  isJumping: boolean
  isShooting: boolean
  facingRight: boolean
}) => {
  const [walkFrame, setWalkFrame] = useState(0)

  useEffect(() => {
    if (isWalking) {
      const interval = setInterval(() => {
        setWalkFrame(prev => (prev + 1) % 2)
      }, 300)
      return () => clearInterval(interval)
    }
  }, [isWalking])

  const bodyColor = selectedCharacter === 'boy' ? '#3B82F6' : '#EC4899'
  const shirtColor = selectedCharacter === 'boy' ? '#1E40AF' : '#BE185D'
  const skinColor = '#F59E0B'
  const hairColor = selectedCharacter === 'boy' ? '#92400E' : '#7C2D12'
  const pantsColor = '#374151'

  return (
    <div 
      className="relative w-16 h-16"
      style={{ 
        imageRendering: 'pixelated',
        transform: `scaleX(${facingRight ? 1 : -1})`
      }}
    >
      {/* Character body - improved pixelated style */}
      <div className="absolute inset-0">
        {/* Hair */}
        <div 
          className="absolute w-6 h-2 top-0 left-1/2 transform -translate-x-1/2 rounded-t"
          style={{ backgroundColor: hairColor }}
        />
        
        {/* Head */}
        <div 
          className="absolute w-5 h-4 top-1 left-1/2 transform -translate-x-1/2 rounded"
          style={{ backgroundColor: skinColor }}
        />
        
        {/* Eyes */}
        <div 
          className="absolute w-1 h-1 top-2 left-4 bg-black rounded-full"
        />
        <div 
          className="absolute w-1 h-1 top-2 left-6 bg-black rounded-full"
        />
        
        {/* Body/Shirt */}
        <div 
          className="absolute w-6 h-5 top-5 left-1/2 transform -translate-x-1/2 rounded"
          style={{ backgroundColor: shirtColor }}
        />
        
        {/* Arms */}
        <div 
          className={`absolute w-2 h-4 top-6 transition-all duration-100 rounded ${
            isShooting ? 'left-7 -rotate-12' : 'left-1'
          }`}
          style={{ backgroundColor: skinColor }}
        />
        <div 
          className="absolute w-2 h-4 top-6 right-1 rounded"
          style={{ backgroundColor: skinColor }}
        />
        
        {/* Gun when shooting */}
        {isShooting && (
          <div 
            className="absolute w-3 h-1 top-7 left-8 bg-gray-800 rounded"
          />
        )}
        
        {/* Pants */}
        <div 
          className="absolute w-6 h-3 top-10 left-1/2 transform -translate-x-1/2 rounded"
          style={{ backgroundColor: pantsColor }}
        />
        
        {/* Legs */}
        <div 
          className={`absolute w-2 h-4 top-13 transition-transform duration-200 rounded ${
            isWalking ? (walkFrame === 0 ? 'left-2' : 'left-3') : 'left-2'
          }`}
          style={{ backgroundColor: pantsColor }}
        />
        <div 
          className={`absolute w-2 h-4 top-13 transition-transform duration-200 rounded ${
            isWalking ? (walkFrame === 0 ? 'right-3' : 'right-2') : 'right-2'
          }`}
          style={{ backgroundColor: pantsColor }}
        />
        
        {/* Shoes */}
        <div 
          className={`absolute w-3 h-1 top-16 transition-transform duration-200 rounded ${
            isWalking ? (walkFrame === 0 ? 'left-1' : 'left-2') : 'left-1'
          }`}
          style={{ backgroundColor: '#1F2937' }}
        />
        <div 
          className={`absolute w-3 h-1 top-16 transition-transform duration-200 rounded ${
            isWalking ? (walkFrame === 0 ? 'right-2' : 'right-1') : 'right-1'
          }`}
          style={{ backgroundColor: '#1F2937' }}
        />
        
        {/* Double jump effect */}
        {isJumping && (
          <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 text-sm">
            <motion.div
              animate={{ y: [0, -10, 0], opacity: [1, 0.5, 1] }}
              transition={{ duration: 0.5, repeat: Infinity }}
            >
              🌟
            </motion.div>
          </div>
        )}
        
        {/* Shooting effect */}
        {isShooting && (
          <motion.div 
            className="absolute -right-3 top-6 text-lg"
            initial={{ scale: 0, rotate: 0 }}
            animate={{ scale: [0, 1.2, 0], rotate: [0, 90, 180] }}
            transition={{ duration: 0.2 }}
          >
            🔥
          </motion.div>
        )}
      </div>
    </div>
  )
}

export const Hero = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  const characterRef = useRef<HTMLDivElement>(null)
  const [character, setCharacter] = useState<Character>({
    x: 400,
    y: 300,
    velocityX: 0,
    velocityY: 0,
    isGrounded: false,
    facingRight: true,
    isWalking: false,
    isJumping: false,
    isShooting: false,
    jumpCount: 0
  })
  
  const [showCharacterSelect, setShowCharacterSelect] = useState(true)
  const [selectedCharacter, setSelectedCharacter] = useState<'boy' | 'girl' | null>(null)
  const [platforms, setPlatforms] = useState<Platform[]>([])
  const [destroyedElements, setDestroyedElements] = useState<Set<string>>(new Set())
  const [keys, setKeys] = useState<Set<string>>(new Set())
  const [pressedKeys, setPressedKeys] = useState<Set<string>>(new Set())
  const [bullets, setBullets] = useState<Bullet[]>([])

  // Character selection
  const selectCharacter = (type: 'boy' | 'girl') => {
    setSelectedCharacter(type)
    setShowCharacterSelect(false)
  }

  // Keyboard input handling with proper key press detection
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent default behavior for game keys
      if (['Space', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'KeyA', 'KeyW', 'KeyS', 'KeyD', 'KeyX', 'KeyZ'].includes(e.code)) {
        e.preventDefault()
      }
      
      // Only add to keys if not already pressed (prevents key repeat)
      if (!pressedKeys.has(e.code)) {
        setKeys(prev => new Set(prev).add(e.code))
        setPressedKeys(prev => new Set(prev).add(e.code))
      }
    }

    const handleKeyUp = (e: KeyboardEvent) => {
      if (['Space', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'KeyA', 'KeyW', 'KeyS', 'KeyD', 'KeyX', 'KeyZ'].includes(e.code)) {
        e.preventDefault()
      }
      setKeys(prev => {
        const newKeys = new Set(prev)
        newKeys.delete(e.code)
        return newKeys
      })
      setPressedKeys(prev => {
        const newKeys = new Set(prev)
        newKeys.delete(e.code)
        return newKeys
      })
    }

    if (!showCharacterSelect) {
      window.addEventListener('keydown', handleKeyDown)
      window.addEventListener('keyup', handleKeyUp)
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [showCharacterSelect, pressedKeys])

  // Platform detection
  const updatePlatforms = useCallback(() => {
    if (!containerRef.current) return

    const elements = containerRef.current.querySelectorAll('[data-platform]')
    const newPlatforms: Platform[] = []

    elements.forEach((element) => {
      const rect = element.getBoundingClientRect()
      const containerRect = containerRef.current!.getBoundingClientRect()
      
      // Check if element is destructible
      const tagName = element.tagName.toLowerCase()
      const isDestructible = tagName === 'p' || tagName === 'h1' || tagName === 'h2' || tagName === 'h3' || 
                           element.getAttribute('data-destructible') === 'true'
      
      newPlatforms.push({
        x: rect.left - containerRect.left,
        y: rect.top - containerRect.top,
        width: rect.width,
        height: rect.height,
        element: element as HTMLElement,
        destructible: isDestructible
      })
    })

    setPlatforms(newPlatforms)
  }, [])

  // Initialize platforms
  useEffect(() => {
    if (!showCharacterSelect) {
      setTimeout(updatePlatforms, 100)
      window.addEventListener('resize', updatePlatforms)
      return () => window.removeEventListener('resize', updatePlatforms)
    }
  }, [showCharacterSelect, updatePlatforms])

  // Bullet physics
  useEffect(() => {
    if (showCharacterSelect) return

    const bulletLoop = () => {
      setBullets(prevBullets => {
        return prevBullets.map(bullet => ({
          ...bullet,
          x: bullet.x + bullet.velocityX,
          y: bullet.y + bullet.velocityY
        })).filter(bullet => {
          // Remove bullets that are out of bounds or hit platforms
          const containerWidth = containerRef.current?.clientWidth || 800
          const containerHeight = containerRef.current?.clientHeight || 600
          
          if (bullet.x < 0 || bullet.x > containerWidth || bullet.y < 0 || bullet.y > containerHeight) {
            return false
          }

          // Check bullet collision with destructible platforms
          for (const platform of platforms) {
            if (platform.destructible) {
              const elementId = platform.element.id || `element-${platform.x}-${platform.y}`
              if (destroyedElements.has(elementId)) continue

              if (bullet.x >= platform.x && bullet.x <= platform.x + platform.width &&
                  bullet.y >= platform.y && bullet.y <= platform.y + platform.height) {
                // Destroy element
                setDestroyedElements(prev => new Set(prev).add(elementId))
                platform.element.style.opacity = '0'
                platform.element.style.transform = 'scale(0.5) rotate(180deg)'
                platform.element.style.transition = 'all 0.5s ease'
                return false // Remove bullet
              }
            }
          }

          return true
        })
      })
    }

    const interval = setInterval(bulletLoop, 16)
    return () => clearInterval(interval)
  }, [platforms, destroyedElements, showCharacterSelect])

  // Game physics
  useEffect(() => {
    if (showCharacterSelect) return

    const gameLoop = () => {
      setCharacter(prev => {
        let newChar = { ...prev }
        
        // Handle input
        const isLeftPressed = keys.has('ArrowLeft') || keys.has('KeyA')
        const isRightPressed = keys.has('ArrowRight') || keys.has('KeyD')
        const isJumpPressed = keys.has('Space') || keys.has('ArrowUp') || keys.has('KeyW')
        const isShootPressed = keys.has('KeyX') || keys.has('KeyZ')

        // Movement
        if (isLeftPressed) {
          newChar.velocityX = -6
          newChar.facingRight = false
          newChar.isWalking = true
        } else if (isRightPressed) {
          newChar.velocityX = 6
          newChar.facingRight = true
          newChar.isWalking = true
        } else {
          newChar.velocityX *= 0.8 // Friction
          newChar.isWalking = Math.abs(newChar.velocityX) > 0.1
        }

        // Double Jump
        if (isJumpPressed && (newChar.isGrounded || newChar.jumpCount < 2)) {
          if (newChar.isGrounded) {
            newChar.velocityY = -16
            newChar.jumpCount = 1
          } else if (newChar.jumpCount === 1) {
            newChar.velocityY = -14
            newChar.jumpCount = 2
          }
          newChar.isGrounded = false
          newChar.isJumping = true
          
          // Clear jump key to prevent spam
          setKeys(prev => {
            const newKeys = new Set(prev)
            newKeys.delete('Space')
            newKeys.delete('ArrowUp')
            newKeys.delete('KeyW')
            return newKeys
          })
        }

        // Shooting
        if (isShootPressed && !prev.isShooting) {
          newChar.isShooting = true
          
          // Create bullet
          const bulletId = `bullet-${Date.now()}-${Math.random()}`
          const bulletSpeed = 8
          const bulletDirection = newChar.facingRight ? 1 : -1
          
          setBullets(prevBullets => [...prevBullets, {
            id: bulletId,
            x: newChar.x + (newChar.facingRight ? 64 : 0),
            y: newChar.y + 25,
            velocityX: bulletSpeed * bulletDirection,
            velocityY: 0,
            direction: bulletDirection
          }])
          
          setTimeout(() => {
            setCharacter(c => ({ ...c, isShooting: false }))
          }, 200)
        }

        // Gravity
        newChar.velocityY += 0.8
        
        // Update position
        newChar.x += newChar.velocityX
        newChar.y += newChar.velocityY

        // Container boundaries
        const containerWidth = containerRef.current?.clientWidth || 800
        const containerHeight = containerRef.current?.clientHeight || 600

        // Ground collision (bottom of hero section)
        if (newChar.y > containerHeight - 100) {
          newChar.y = containerHeight - 100
          newChar.velocityY = 0
          newChar.isGrounded = true
          newChar.isJumping = false
          newChar.jumpCount = 0
        }

        // Platform collision
        let onPlatform = false
        platforms.forEach(platform => {
          const elementId = platform.element.id || `element-${platform.x}-${platform.y}`
          if (destroyedElements.has(elementId)) return

          // Character bounds
          const charLeft = newChar.x
          const charRight = newChar.x + 64
          const charTop = newChar.y
          const charBottom = newChar.y + 64

          // Platform bounds
          const platLeft = platform.x
          const platRight = platform.x + platform.width
          const platTop = platform.y
          const platBottom = platform.y + platform.height

          // Check collision
          if (charRight > platLeft && charLeft < platRight && 
              charBottom > platTop && charTop < platBottom) {
            
            // Top collision (landing on platform)
            if (prev.y + 64 <= platTop && newChar.velocityY > 0) {
              newChar.y = platTop - 64
              newChar.velocityY = 0
              onPlatform = true
              newChar.jumpCount = 0
            }
            // Bottom collision (hitting platform from below)
            else if (prev.y >= platBottom && newChar.velocityY < 0) {
              newChar.y = platBottom
              newChar.velocityY = 0
            }
            // Side collisions
            else if (prev.x + 64 <= platLeft) {
              newChar.x = platLeft - 64
              newChar.velocityX = 0
            } else if (prev.x >= platRight) {
              newChar.x = platRight
              newChar.velocityX = 0
            }
          }
        })

        // Update grounded state
        if (onPlatform || newChar.y >= containerHeight - 100) {
          newChar.isGrounded = true
          newChar.isJumping = false
        } else if (newChar.velocityY > 0) {
          newChar.isGrounded = false
        }

        // Screen boundaries
        if (newChar.x < 0) newChar.x = 0
        if (newChar.x > containerWidth - 64) {
          newChar.x = containerWidth - 64
        }
        if (newChar.y < 0) {
          newChar.y = 0
          newChar.velocityY = 0
        }

        return newChar
      })
    }

    const interval = setInterval(gameLoop, 16) // 60 FPS
    return () => clearInterval(interval)
  }, [keys, platforms, destroyedElements, showCharacterSelect])

  const scrollToContact = () => {
    const contactSection = document.querySelector('#contact')
    contactSection?.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    })
  }

  return (
    <section 
      ref={containerRef}
      className="relative min-h-screen overflow-hidden px-4 py-24 text-gray-200"
      style={{
        background: `linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%)`
      }}
    >
      {/* Character Select Modal */}
      <AnimatePresence>
        {showCharacterSelect && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 flex items-center justify-center"
            style={{
              backgroundColor: 'rgba(0, 0, 0, 0.8)',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)'
            }}
          >
            <div className="text-center">
              <h2 className="text-4xl font-bold text-white mb-8">Choose Your Character</h2>
              <div className="flex gap-8 justify-center">
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => selectCharacter('boy')}
                  className="cursor-pointer bg-blue-600 p-8 rounded-lg text-white text-center"
                >
                  <div className="text-6xl mb-4">🧑‍💻</div>
                  <h3 className="text-xl font-semibold">Dev Boy</h3>
                  <p className="text-sm opacity-75">Fast & Agile</p>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => selectCharacter('girl')}
                  className="cursor-pointer bg-pink-600 p-8 rounded-lg text-white text-center"
                >
                  <div className="text-6xl mb-4">👩‍💻</div>
                  <h3 className="text-xl font-semibold">Dev Girl</h3>
                  <p className="text-sm opacity-75">Smart & Strong</p>
                </motion.div>
              </div>
              <p className="text-gray-400 mt-6">Use Arrow Keys or WASD to move, Space to jump (double jump!), X to shoot!</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Character */}
      {!showCharacterSelect && selectedCharacter && (
        <motion.div
          ref={characterRef}
          className="absolute z-20 transition-transform duration-100"
          style={{
            left: character.x,
            top: character.y
          }}
        >
          <PixelCharacter
            selectedCharacter={selectedCharacter}
            isWalking={character.isWalking}
            isJumping={character.isJumping}
            isShooting={character.isShooting}
            facingRight={character.facingRight}
          />
          
          {/* Walking dust effect */}
          {character.isWalking && character.isGrounded && (
            <motion.div
              className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 text-xs opacity-60"
              animate={{ opacity: [0.6, 1, 0.6] }}
              transition={{ duration: 0.3, repeat: Infinity }}
            >
              💨
            </motion.div>
          )}
        </motion.div>
      )}

      {/* Bullets */}
      {bullets.map(bullet => (
        <motion.div
          key={bullet.id}
          className="absolute z-15 w-2 h-1 bg-yellow-400 rounded-full shadow-lg"
          style={{
            left: bullet.x,
            top: bullet.y,
            boxShadow: '0 0 10px #facc15'
          }}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0 }}
        />
      ))}

      {/* Game UI */}
      {!showCharacterSelect && (
        <div className="absolute top-4 left-4 z-30 bg-black/50 rounded-lg p-3 text-white text-sm">
          <div>Controls:</div>
          <div>Arrow Keys / WASD - Move</div>
          <div>Space - Jump (Double Jump!)</div>
          <div>X - Shoot (destroy malware)</div>
        </div>
      )}

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen gap-12">
        {/* Multiple Floating Platforms */}
        <div className="absolute left-20 top-40">
          <motion.div
            data-platform="true"
            className="bg-gradient-to-r from-purple-600 to-blue-600 px-6 py-3 rounded-lg text-white font-semibold"
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            Welcome Platform
          </motion.div>
        </div>

        <div className="absolute right-20 top-60">
          <motion.div
            data-platform="true"
            className="bg-gradient-to-r from-green-600 to-teal-600 px-6 py-3 rounded-lg text-white font-semibold"
            animate={{ y: [0, -15, 0] }}
            transition={{ duration: 3, repeat: Infinity, delay: 1 }}
          >
            Skills Platform
          </motion.div>
        </div>

        <div className="absolute left-1/2 top-32 transform -translate-x-1/2">
          <motion.div
            data-platform="true"
            className="bg-gradient-to-r from-yellow-600 to-orange-600 px-4 py-2 rounded-lg text-white font-semibold"
            animate={{ x: [-20, 20, -20] }}
            transition={{ duration: 4, repeat: Infinity }}
          >
            Moving Platform
          </motion.div>
        </div>

        <div className="absolute left-10 top-96">
          <motion.div
            data-platform="true"
            className="bg-gradient-to-r from-pink-600 to-purple-600 px-4 py-2 rounded-lg text-white font-semibold"
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            Jump Pad
          </motion.div>
        </div>

        <div className="absolute right-10 top-80">
          <motion.div
            data-platform="true"
            className="bg-gradient-to-r from-indigo-600 to-blue-600 px-4 py-2 rounded-lg text-white font-semibold"
          >
            Safe Zone
          </motion.div>
        </div>

        <div className="absolute left-32 top-56">
          <motion.div
            data-platform="true"
            className="bg-gradient-to-r from-cyan-600 to-blue-600 px-3 py-2 rounded-lg text-white font-semibold"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            Boost
          </motion.div>
        </div>

        <div className="absolute right-32 top-45">
          <motion.div
            data-platform="true"
            className="bg-gradient-to-r from-emerald-600 to-green-600 px-3 py-2 rounded-lg text-white font-semibold"
            animate={{ y: [-5, 5, -5] }}
            transition={{ duration: 1.8, repeat: Infinity }}
          >
            Float
          </motion.div>
        </div>

        <div className="absolute left-64 bottom-60">
          <motion.div
            data-platform="true"
            className="bg-gradient-to-r from-red-600 to-pink-600 px-4 py-2 rounded-lg text-white font-semibold"
          >
            High Platform
          </motion.div>
        </div>

        <div className="absolute right-64 bottom-52">
          <motion.div
            data-platform="true"
            className="bg-gradient-to-r from-violet-600 to-purple-600 px-4 py-2 rounded-lg text-white font-semibold"
          >
            Upper Level
          </motion.div>
        </div>

        {/* Status Badge - Platform */}
        <motion.span 
          data-platform="true"
          className="inline-block rounded-full bg-gray-600/50 px-6 py-3 text-lg font-semibold"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          Open for work
        </motion.span>

        {/* Malware/Virus Elements - Destructible */}
        <div className="absolute left-10 top-80">
          <motion.div
            data-platform="true"
            data-destructible="true"
            id="malware-1"
            className="bg-red-600/80 border-2 border-red-400 px-4 py-2 rounded-lg text-red-100 font-bold animate-pulse"
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 4, repeat: Infinity }}
          >
            🦠 MALWARE.exe
          </motion.div>
        </div>

        <div className="absolute right-10 top-96">
          <motion.div
            data-platform="true"
            data-destructible="true"
            id="virus-1"
            className="bg-yellow-600/80 border-2 border-yellow-400 px-4 py-2 rounded-lg text-yellow-100 font-bold animate-bounce"
          >
            ⚠️ VIRUS.dll
          </motion.div>
        </div>

        <div className="absolute left-32 bottom-40">
          <motion.div
            data-platform="true"
            data-destructible="true"
            id="trojan-1"
            className="bg-purple-600/80 border-2 border-purple-400 px-4 py-2 rounded-lg text-purple-100 font-bold"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            🐴 TROJAN.bat
          </motion.div>
        </div>

        <div className="absolute right-40 top-72">
          <motion.div
            data-platform="true"
            data-destructible="true"
            id="spyware-1"
            className="bg-orange-600/80 border-2 border-orange-400 px-4 py-2 rounded-lg text-orange-100 font-bold"
            animate={{ opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            👁️ SPYWARE.sys
          </motion.div>
        </div>

        <div className="absolute left-56 top-64">
          <motion.div
            data-platform="true"
            data-destructible="true"
            id="adware-1"
            className="bg-green-600/80 border-2 border-green-400 px-4 py-2 rounded-lg text-green-100 font-bold"
            animate={{ x: [-10, 10, -10] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            📢 ADWARE.dll
          </motion.div>
        </div>

        {/* Main Title - Destructible */}
        <div className="text-center space-y-4">
          <motion.h1 
            data-platform="true"
            className="text-white/40 text-6xl md:text-7xl font-black"
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            Hi, I am
          </motion.h1>
          <motion.h1 
            data-platform="true"
            className="max-w-4xl bg-gradient-to-br from-white to-gray-400 bg-clip-text font-black leading-tight text-transparent text-5xl md:text-7xl px-8 py-4 rounded-2xl" 
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.9 }}
          >
            Gilbert Hasiholan S
          </motion.h1>
        </div>

        {/* Description - Platform and Destructible */}
        <motion.p 
          data-platform="true"
          className="max-w-2xl text-lg leading-relaxed text-center bg-white/5 p-6 rounded-2xl backdrop-blur-sm border border-white/10"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1.1 }}
        > 
          Fullstack Developer based in Bandar Lampung with over 2 years of experience, 
          specializing in building end-to-end web applications.
        </motion.p>

        {/* Action Buttons - Platforms */}
        <div className="flex flex-col sm:flex-row gap-6 items-center">
          <motion.button
            data-platform="true"
            onClick={() => window.open('https://www.canva.com/design/DAGhsbBQGPo/Cq0wE9ktnUkrnOQnH4F9KA/view?utm_content=DAGhsbBQGPo&utm_campaign=designshare&utm_medium=link2&utm_source=uniquelinks&utlId=h6f3875e230', '_blank')}
            whileHover={{ scale: 1.05, y: -5 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-3 rounded-full px-8 py-4 border-2 border-gray-300 shadow-lg bg-white/10 backdrop-blur-md text-lg font-semibold"
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 1.3 }}
          >
            Download CV
            <FiArrowRight className="ml-1"/>   
          </motion.button>

          <motion.button
            data-platform="true"
            onClick={scrollToContact}
            whileHover={{ scale: 1.05, y: -5 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-3 rounded-full px-8 py-4 border-2 border-gray-300 shadow-lg bg-white/10 backdrop-blur-md text-lg font-semibold"
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 1.5 }}
          >
            Contact Me!
            <FiMail className="ml-1"/>   
          </motion.button>
        </div>

        {/* Social Links - Platform */}
        <motion.div
          data-platform="true"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 2, type: "spring" }}
          className="flex flex-col items-center w-full group"
        >
          <div
            className="relative rounded-2xl px-8 py-6 shadow-2xl flex flex-col items-center w-full max-w-2xl border border-white/10 overflow-hidden"
            style={{
              background: "rgba(20, 30, 40, 0.65)",
              backdropFilter: "blur(12px)",
              WebkitBackdropFilter: "blur(12px)",
            }}
          >
            <span className="mb-4 text-gray-300 font-semibold tracking-wide text-lg">Find me on</span>
            <ul className="flex gap-6 flex-wrap justify-center">
              {[
                { href: "https://github.com/ILMNX", icon: "github", color: "#13FFAA" },
                { href: "https://www.linkedin.com/in/gilberthasiholan/", icon: "linkedin", color: "#1E67C6" },
                { href: "https://instagram.com/gilberths__", icon: "instagram", color: "#CE84CF" },
                { href: "https://telegram.org", icon: "telegram", color: "#DD335C" }
              ].map((social, index) => (
                <motion.a
                  key={social.icon}
                  href={social.href}
                  className="text-gray-200 flex items-center justify-center w-12 h-12 rounded-full transition-colors bg-white/5 hover:bg-white/10"
                  style={{ '--hover-color': social.color } as React.CSSProperties}
                  whileHover={{ scale: 1.2, rotate: index % 2 === 0 ? -8 : 8 }}
                  whileTap={{ scale: 0.95 }}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <div className="w-8 h-8 bg-current rounded opacity-75"></div>
                </motion.a>
              ))}
            </ul>
          </div>
        </motion.div>
      </div>
    </section>
  )
}