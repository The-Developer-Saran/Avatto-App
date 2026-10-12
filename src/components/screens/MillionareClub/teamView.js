import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState, useRef } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ActivityIndicator,
    ScrollView,
    Animated,
    Dimensions,
    StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Svg, { Line, Path } from "react-native-svg";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

// Rectangle (node card) dimensions — responsive & capped so 2 fit per row without overflow.
const NODE_W = Math.min(140, Math.round(SCREEN_WIDTH * 0.34));
const NODE_H = Math.round(NODE_W * 0.52);
const NODE_RADIUS = 10;
const NODE_FONT = Math.max(12, Math.round(NODE_W * 0.11));

// const COLORS = {
//   bg: "#0d020206",
//   card: "#1A1928",
//   border: "#2D2B45",
//   rootGrad1: "#7C3AED",
//   rootGrad2: "#4F46E5",
//   nodeA: "#0EA5E9",
//   nodeB: "#06B6D4",
//   nodeC: "#10B981",
//   nodeD: "#F59E0B",
//   nodeE: "#EF4444",
//   nodeF: "#EC4899",
//   nilBg: "#1E1D2E",
//   nilText: "#4B4A6A",
//   text: "#FFFFFF",
//   subText: "#A09FC0",
//   accent: "#7C3AED",
//   connLine: "#2D2B45",
//   selectedBorder: "#7C3AED",
// };



const COLORS = {
    bg: "#FFFFFF",          // pure white background
    card: "#F8FAFC",        // soft half-white (light gray)
    border: "#E5E7EB",      // light border

    rootGrad1: "#7C3AED",
    rootGrad2: "#4F46E5",

    nodeA: "#0EA5E9",
    nodeB: "#06B6D4",
    nodeC: "#10B981",
    nodeD: "#F59E0B",
    nodeE: "#EF4444",
    nodeF: "#EC4899",

    nilBg: "#F1F5F9",       // light placeholder background
    nilText: "#94A3B8",     // muted text

    text: "#111827",        // main text → black
    subText: "#6B7280",     // secondary text → gray

    accent: "#A6222C",

    connLine: "#D1D5DB",    // light connector lines
    selectedBorder: "#7C3AED",
};
const NODE_COLORS = [
    "#7C3AED",
    "#0EA5E9",
    "#06B6D4",
    "#10B981",
    "#F59E0B",
    "#EF4444",
    "#EC4899",
    "#8B5CF6",
];

const fetchTree = async (id) => {
    const formData = new FormData();
    formData.append("apiType", "Genealogy");
    formData.append("avattoId", id);
    // formData.append("avattoId", 9495);

    console.log("Fetching tree for ID:", formData);
    const res = await fetch("https://avatto.info/binary/getTree", {
        method: "POST",
        body: formData,
    });
    return await res.json();
};

// ─── Single Node Circle ───────────────────────────────────────────
const NodeCircle = ({ name, id, color, size = 64, onPress, isSelected, isNil, depth = 0 }) => {
    const scale = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.spring(scale, {
            toValue: 1,
            delay: depth * 80,
            useNativeDriver: true,
            tension: 80,
            friction: 8,
        }).start();
    }, []);

    const handlePress = () => {
        if (!isNil && onPress) {
            Animated.sequence([
                Animated.timing(scale, { toValue: 0.88, duration: 80, useNativeDriver: true }),
                Animated.spring(scale, { toValue: 1, useNativeDriver: true }),
            ]).start();
            onPress(id);
        }
    };

    if (isNil) {
        return (
            <View style={[styles.nilCircle, { width: NODE_W, height: NODE_H, borderRadius: NODE_RADIUS }]}>
                <Text style={styles.nilText}>—</Text>
            </View>
        );
    }

    return (
        <TouchableOpacity onPress={handlePress} activeOpacity={0.85}>
            <Animated.View style={{ transform: [{ scale }] }}>
                <View
                    style={[
                        styles.nodeOuter,
                        {
                            width: NODE_W,
                            height: NODE_H,
                            borderRadius: NODE_RADIUS,
                            borderColor: isSelected ? "#FFFFFF" : color + "44",
                            borderWidth: isSelected ? 2.5 : 1.5,
                        },
                    ]}
                >
                    <View
                        style={[
                            styles.nodeInner,
                            {
                                width: NODE_W,
                                height: NODE_H,
                                borderRadius: NODE_RADIUS,
                                backgroundColor: color,
                            },
                        ]}
                    >
                        {/* <Text style={[styles.nodeText, { fontSize: name?.length > 8 ? 8 : name?.length > 5 ? 10 : 12 }]} numberOfLines={2}> */}
                        <Text style={[styles.nodeText, { fontSize: NODE_FONT }]} numberOfLines={2}>
                            {name || "—"}
                        </Text>
                    </View>
                </View>
            </Animated.View>
        </TouchableOpacity>
    );
};

// ─── Sub Tree Panel ───────────────────────────────────────────────
const SubTree = ({ tree, onNodePress, selectedId }) => {
    if (!tree) return null;

    const nodeSize = 56;
    const colW = SCREEN_WIDTH / 4;

    const nodes = [
        { name: tree.nameA, id: tree.idA, color: COLORS.nodeA, col: 1, row: 1 },
        { name: tree.nameB, id: tree.idB, color: COLORS.nodeB, col: 3, row: 1 },
        { name: tree.nameC, id: tree.idC, color: COLORS.nodeC, col: 0, row: 2 },
        { name: tree.nameD, id: tree.idD, color: COLORS.nodeD, col: 2, row: 2 },
        { name: tree.nameE, id: tree.idE, color: COLORS.nodeE, col: 1.5, row: 2 },
        { name: tree.nameF, id: tree.idF, color: COLORS.nodeF, col: 3, row: 2 },
    ];

    return (
        <View style={styles.subTreePanel}>
            {/* Panel Header */}
            <View style={styles.subTreeHeader}>
                <View style={[styles.subTreeHeaderDot, { backgroundColor: COLORS.accent }]} />
                <Text style={styles.subTreeHeaderText}>Sub tree — {tree.clubName}</Text>
            </View>

            {/* Level 1 */}
            <View style={styles.treeLevel}>
                <View style={styles.treeLevelRow}>
                    <NodeCircle
                        name={tree.nameA}
                        id={tree.idA}
                        color={COLORS.nodeA}
                        size={nodeSize}
                        onPress={onNodePress}
                        isSelected={selectedId === tree.idA}
                        isNil={!tree.idA || tree.nameA === "Nil"}
                        depth={1}
                    />
                    <NodeCircle
                        name={tree.nameB}
                        id={tree.idB}
                        color={COLORS.nodeB}
                        size={nodeSize}
                        onPress={onNodePress}
                        isSelected={selectedId === tree.idB}
                        isNil={!tree.idB || tree.nameB === "Nil"}
                        depth={1}
                    />
                </View>
            </View>

            {/* Level 2 removed — sub tree limited to 2 levels */}
        </View>
    );
};

// ─── MAIN ─────────────────────────────────────────────────────────
const TeamView = () => {
    const [rootTree, setRootTree] = useState(null);
    const [subTree, setSubTree] = useState(null);
    const [loading, setLoading] = useState(true);
    const [subLoading, setSubLoading] = useState(false);
    const [selectedId, setSelectedId] = useState(null);
    const [history, setHistory] = useState([]);
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const subFade = useRef(new Animated.Value(0)).current;





    const loadRoot = async (id = "9495") => {
        setLoading(true);
        try {
            const data = await fetchTree(id);
            setRootTree(data);
            Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }).start();
        } catch (e) {
            console.log(e);
        }
        setLoading(false);
    };


    useEffect(() => {
        const LoadData = async () => {
            try {
                const value = await AsyncStorage.getItem('user'); // Wait for AsyncStorage to retrieve the item
                console.log(value)
                if (value !== null) {
                    loadRoot(value);
                }
            }
            catch (error) {
                console.error('Error reading AsyncStorage:', error.message);
            }
        }
        LoadData();
    }, []);



    const handleNodePress = async (id) => {
        if (!id || id === selectedId) return;
        setSelectedId(id);
        setSubLoading(true);
        subFade.setValue(0);
        try {
            const data = await fetchTree(id);
            setSubTree(data);
            setHistory((prev) => [...prev.slice(-4), id]);
            Animated.timing(subFade, { toValue: 1, duration: 400, useNativeDriver: true }).start();
        } catch (e) {
            console.log(e);
        }
        setSubLoading(false);
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <StatusBar barStyle="light-content" backgroundColor={COLORS.bg} />
                <View style={styles.loadingPulse}>
                    <ActivityIndicator size="large" color={COLORS.accent} />
                </View>
                <Text style={styles.loadingText}>Loading tree...</Text>
            </View>
        );
    }

    if (!rootTree) return null;

    return (
        <SafeAreaView style={styles.root}>
            <StatusBar barStyle="light-content" backgroundColor={COLORS.bg} />
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* ── Header ── */}
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>Binary Tree</Text>
                    <View style={styles.headerBadge}>
                        <Text style={styles.headerBadgeText}>ID {rootTree.clubId}</Text>
                    </View>
                </View>

                {/* ── Root Tree Card ── */}
                <Animated.View style={[styles.treeCard, { opacity: fadeAnim }]}>

                    {/* Root node */}
                    <View style={styles.rootRow}>
                        <NodeCircle
                            name={rootTree.clubName}
                            id={rootTree.clubId}
                            color={COLORS.rootGrad1}
                            size={72}
                            onPress={handleNodePress}
                            isSelected={selectedId === rootTree.clubId}
                            depth={0}
                        />
                    </View>

                    {/* Connector lines */}
                    <View style={styles.connectorRow}>
                        <View style={styles.connectorLeft} />
                        <View style={styles.connectorRight} />
                    </View>

                    {/* Level 1 */}
                    <View style={styles.level1Row}>
                        <NodeCircle
                            name={rootTree.nameA}
                            id={rootTree.idA}
                            color={COLORS.nodeA}
                            size={60}
                            onPress={handleNodePress}
                            isSelected={selectedId === rootTree.idA}
                            isNil={!rootTree.idA || rootTree.nameA === "Nil"}
                            depth={1}
                        />
                        <NodeCircle
                            name={rootTree.nameB}
                            id={rootTree.idB}
                            color={COLORS.nodeB}
                            size={60}
                            onPress={handleNodePress}
                            isSelected={selectedId === rootTree.idB}
                            isNil={!rootTree.idB || rootTree.nameB === "Nil"}
                            depth={1}
                        />
                    </View>

                    {/* Level 2 removed — hierarchy limited to 2 levels (Root + Level 1) */}

                    {/* Hint */}
                    {!selectedId && (
                        <View style={styles.hint}>
                            <Text style={styles.hintText}>Tap any node to view its sub tree</Text>
                        </View>
                    )}
                </Animated.View>

                {/* ── Sub Tree ── */}
                {(subLoading || subTree) && (
                    <View style={styles.subSection}>
                        <View style={styles.subSectionTitle}>
                            <View style={styles.subSectionLine} />
                            <Text style={styles.subSectionTitleText}>Sub tree</Text>
                            <View style={styles.subSectionLine} />
                        </View>

                        {subLoading ? (
                            <View style={styles.subLoadingBox}>
                                <ActivityIndicator color={COLORS.accent} />
                            </View>
                        ) : (
                            <Animated.View style={{ opacity: subFade }}>
                                <SubTree
                                    tree={subTree}
                                    onNodePress={handleNodePress}
                                    selectedId={selectedId}
                                />
                            </Animated.View>
                        )}
                    </View>
                )}

                {/* ── History ── */}
                {/* {history.length > 0 && (
          <View style={styles.historyRow}>
            <Text style={styles.historyLabel}>Recent: </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {history.map((hid, i) => (
                <TouchableOpacity
                  key={i}
                  style={[
                    styles.historyChip,
                    selectedId === hid && styles.historyChipActive,
                  ]}
                  onPress={() => handleNodePress(hid)}
                >
                  <Text
                    style={[
                      styles.historyChipText,
                      selectedId === hid && styles.historyChipTextActive,
                    ]}
                  >
                    {hid}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )} */}

                <View style={{ height: 40 }} />
            </ScrollView>
        </SafeAreaView>

    );
};

export default TeamView;

const styles = StyleSheet.create({
    root: {
        flex: 1,
        backgroundColor: COLORS.bg,
    },
    scrollContent: {
        paddingHorizontal: 16,
        paddingTop: 16,
    },

    // Loading
    loadingContainer: {
        flex: 1,
        backgroundColor: COLORS.bg,
        justifyContent: "center",
        alignItems: "center",
    },
    loadingPulse: {
        width: 72,
        height: 72,
        borderRadius: 36,
        backgroundColor: COLORS.card,
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 16,
    },
    loadingText: {
        color: COLORS.subText,
        fontSize: 14,
    },

    // Header
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 20,
    },
    headerTitle: {
        color: COLORS.text,
        fontSize: 22,
        fontWeight: "700",
        letterSpacing: -0.5,
    },
    headerBadge: {
        backgroundColor: COLORS.accent + "22",
        borderRadius: 20,
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderWidth: 1,
        borderColor: COLORS.accent + "44",
    },
    headerBadgeText: {
        color: COLORS.accent,
        fontSize: 12,
        fontWeight: "600",
    },

    // Tree card
    treeCard: {
        backgroundColor: COLORS.card,
        borderRadius: 20,
        padding: 20,
        borderWidth: 1,
        borderColor: COLORS.border,
        alignItems: "center",
    },
    rootRow: {
        alignItems: "center",
        marginBottom: 4,
    },
    connectorRow: {
        flexDirection: "row",
        width: "55%",
        justifyContent: "space-between",
        height: 28,
        marginBottom: 0,
        position: "relative",
    },
    connectorLeft: {
        position: "absolute",
        left: "25%",
        top: 0,
        width: 2,
        height: "100%",
        backgroundColor: COLORS.connLine,
        borderRadius: 1,
    },
    connectorRight: {
        position: "absolute",
        right: "25%",
        top: 0,
        width: 2,
        height: "100%",
        backgroundColor: COLORS.connLine,
        borderRadius: 1,
    },
    level1Row: {
        flexDirection: "row",
        justifyContent: "space-around",
        width: "90%",
        marginBottom: 4,
    },
    level2ConnRow: {
        flexDirection: "row",
        width: "90%",
        justifyContent: "space-around",
        height: 20,
    },
    level2ConnLeft: {
        flexDirection: "row",
        width: "45%",
        justifyContent: "space-around",
    },
    level2ConnRight: {
        flexDirection: "row",
        width: "45%",
        justifyContent: "space-around",
    },
    connShortV: {
        width: 2,
        height: 20,
        backgroundColor: COLORS.connLine,
        borderRadius: 1,
    },
    level2Row: {
        flexDirection: "row",
        justifyContent: "space-around",
        width: "100%",
    },
    hint: {
        marginTop: 20,
        backgroundColor: COLORS.accent + "15",
        borderRadius: 10,
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderWidth: 1,
        borderColor: COLORS.accent + "30",
    },
    hintText: {
        color: COLORS.accent,
        fontSize: 12,
        textAlign: "center",
    },

    // Node styles
    nodeOuter: {
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "transparent",
    },
    nodeInner: {
        justifyContent: "center",
        alignItems: "center",
        padding: 4,
    },
    nodeText: {
        color: "#FFFFFF",
        fontWeight: "700",
        textAlign: "center",
        letterSpacing: -0.3,
    },
    nilCircle: {
        backgroundColor: COLORS.nilBg,
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 1,
        borderColor: COLORS.border,
        borderStyle: "dashed",
        margin: 3,
    },
    nilText: {
        color: COLORS.nilText,
        fontSize: 14,
    },

    // Sub tree section
    subSection: {
        marginTop: 24,
    },
    subSectionTitle: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 14,
        gap: 10,
    },
    subSectionLine: {
        flex: 1,
        height: 1,
        backgroundColor: COLORS.border,
    },
    subSectionTitleText: {
        color: COLORS.subText,
        fontSize: 12,
        fontWeight: "600",
        textTransform: "uppercase",
        letterSpacing: 1.5,
    },
    subLoadingBox: {
        backgroundColor: COLORS.card,
        borderRadius: 16,
        height: 100,
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 1,
        borderColor: COLORS.border,
    },

    // Sub tree panel
    subTreePanel: {
        backgroundColor: COLORS.card,
        borderRadius: 20,
        padding: 20,
        borderWidth: 1,
        borderColor: COLORS.border,
        alignItems: "center",
    },
    subTreeHeader: {
        flexDirection: "row",
        alignItems: "center",
        alignSelf: "flex-start",
        marginBottom: 20,
        gap: 8,
    },
    subTreeHeaderDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
    },
    subTreeHeaderText: {
        color: COLORS.subText,
        fontSize: 13,
        fontWeight: "600",
    },
    treeLevel: {
        alignItems: "center",
        marginBottom: 4,
    },
    treeLevelRow: {
        flexDirection: "row",
        justifyContent: "space-around",
        width: "100%",
    },
    subDivider: {
        width: "60%",
        height: 1,
        backgroundColor: COLORS.border,
        marginVertical: 12,
    },

    // History
    historyRow: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 20,
    },
    historyLabel: {
        color: COLORS.subText,
        fontSize: 12,
        marginRight: 8,
        fontWeight: "600",
    },
    historyChip: {
        backgroundColor: COLORS.card,
        borderRadius: 20,
        paddingHorizontal: 12,
        paddingVertical: 6,
        marginRight: 8,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    historyChipActive: {
        backgroundColor: COLORS.accent + "22",
        borderColor: COLORS.accent,
    },
    historyChipText: {
        color: COLORS.subText,
        fontSize: 12,
        fontWeight: "600",
    },
    historyChipTextActive: {
        color: COLORS.accent,
    },
});