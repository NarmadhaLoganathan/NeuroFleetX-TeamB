import { motion } from "framer-motion";

const StatsCard = ({ title, value, sub, icon: Icon, color = "from-blue-500 to-blue-600" }) => {
  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ 
        scale: 1.05, 
        y: -8,
        transition: { duration: 0.3 }
      }}
      whileTap={{ scale: 0.98 }}
      className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-6 border border-gray-100 cursor-pointer relative overflow-hidden"
    >
      {/* Background Gradient Effect on Hover */}
      <motion.div
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 0.05 }}
        className={`absolute inset-0 bg-gradient-to-br ${color}`}
      />

      {/* Animated Corner Accent */}
      <motion.div
        initial={{ scale: 0, rotate: 0 }}
        animate={{ scale: 1, rotate: 0 }}
        whileHover={{ scale: 1.2, rotate: 45 }}
        transition={{ duration: 0.3 }}
        className={`absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br ${color} opacity-10 rounded-full blur-2xl`}
      />

      <div className="flex items-center justify-between relative z-10">
        {Icon && (
          <motion.div 
            whileHover={{ 
              rotate: [0, -10, 10, -10, 0],
              scale: 1.1
            }}
            transition={{ duration: 0.5 }}
            className={`p-4 bg-gradient-to-br ${color} rounded-xl shadow-lg group-hover:shadow-xl transition-all duration-300 relative`}
          >
            {/* Glow Effect */}
            <motion.div
              animate={{ 
                scale: [1, 1.2, 1],
                opacity: [0.5, 0.8, 0.5]
              }}
              transition={{ duration: 2, repeat: Infinity }}
              className={`absolute inset-0 bg-gradient-to-br ${color} rounded-xl blur-md opacity-50`}
            />
            <Icon className="w-7 h-7 text-white relative z-10" />
          </motion.div>
        )}
        
        <div className="flex-1 ml-5 text-right">
          <p className="text-sm font-semibold text-gray-500 mb-2 group-hover:text-gray-600 transition-colors">
            {title}
          </p>
          <motion.h3 
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
            className="text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent"
          >
            {value}
          </motion.h3>
          {sub && (
            <motion.p 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xs text-gray-400 mt-2 flex items-center justify-end gap-1 group-hover:text-gray-500 transition-colors"
            >
              {sub}
            </motion.p>
          )}
        </div>
      </div>

      {/* Bottom Accent Line */}
      <motion.div
        initial={{ scaleX: 0 }}
        whileHover={{ scaleX: 1 }}
        transition={{ duration: 0.3 }}
        className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${color} origin-left`}
      />

      {/* Corner Sparkle Effect */}
      <motion.div
        animate={{ 
          rotate: 360,
          scale: [1, 1.2, 1]
        }}
        transition={{ 
          duration: 3, 
          repeat: Infinity,
          ease: "linear"
        }}
        className="absolute top-2 right-2 w-2 h-2 bg-yellow-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <motion.div
          animate={{ scale: [1, 2, 1], opacity: [1, 0, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="absolute inset-0 bg-yellow-400 rounded-full"
        />
      </motion.div>
    </motion.div>
  );
};

export default StatsCard;