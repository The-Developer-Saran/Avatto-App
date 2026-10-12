import React, { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  Linking,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from '@react-native-vector-icons/ant-design';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import RenderHtml from 'react-native-render-html';
import { useNavigation } from '@react-navigation/native';
import { BaseUrl } from '../BaseUrl/BaseUrl';

const HEADER_COLOR = '#B5232E';

const MyNotifications = () => {
  const [list, setList] = useState([]);
  const [loader, setLoader] = useState(true);

  const navigation = useNavigation();
  const contentWidth = useMemo(() => wp(82), []);

  const getNotifications = async () => {
    const inputData = new FormData();
    inputData.append('action', 'get');

    try {
      const response = await fetch(`${BaseUrl}sendUserNotification`, {
        method: 'POST',
        body: inputData,
      });
      const responseData = await response.json();

      if (responseData?.Response?.Success == 1) {
        setList(responseData?.Response?.Data || []);
      } else {
        setList([]);
        console.log(responseData?.Response?.Message);
      }
    } catch (err) {
      console.log('Error while fetching notification list ', err);
      setList([]);
    } finally {
      setLoader(false);
    }
  };

  useEffect(() => {
    getNotifications();
  }, []);

  const formatDate = dateString => {
    if (!dateString) {
      return '';
    }

    const date = new Date(dateString);

    if (Number.isNaN(date.getTime())) {
      return '';
    }

    return (
      String(date.getDate()).padStart(2, '0') +
      '-' +
      String(date.getMonth() + 1).padStart(2, '0') +
      '-' +
      date.getFullYear()
    );
  };

  const getNotificationLink = item => {
    const linkCandidates = [item?.nt_link, item?.nt_url, item?.link, item?.url];
    return linkCandidates.find(value => typeof value === 'string' && value.trim().length > 0) || '';
  };

  const normalizeUrl = url => {
    if (!url || typeof url !== 'string') {
      return '';
    }

    const trimmedUrl = url.trim();

    if (!trimmedUrl) {
      return '';
    }

    if (/^https?:\/\//i.test(trimmedUrl)) {
      return trimmedUrl;
    }

    return `https://${trimmedUrl}`;
  };

  const openBrowserLink = async rawUrl => {
    const finalUrl = normalizeUrl(rawUrl);

    if (!finalUrl) {
      return;
    }

    try {
      const supported = await Linking.canOpenURL(finalUrl);

      if (supported) {
        await Linking.openURL(finalUrl);
      }
    } catch (error) {
      console.log('Error while opening link', error);
    }
  };

  const convertPlainUrlsToAnchors = html => {
    if (!html || typeof html !== 'string') {
      return '';
    }

    const anchorPlaceholders = [];
    const anchorProtectedHtml = html.replace(/<a\b[^>]*>[\s\S]*?<\/a>/gi, match => {
      const placeholder = `__ANCHOR_PLACEHOLDER_${anchorPlaceholders.length}__`;
      anchorPlaceholders.push(match);
      return placeholder;
    });

    const urlRegex = /((https?:\/\/)[^\s<]+)/gi;
    const htmlWithAnchors = anchorProtectedHtml.replace(urlRegex, url => {
      return `<a href="${url}">${url}</a>`;
    });

    return htmlWithAnchors.replace(/__ANCHOR_PLACEHOLDER_(\d+)__/g, (_match, index) => {
      return anchorPlaceholders[Number(index)] || '';
    });
  };

  const renderNotificationCard = ({ item }) => {
    const imageUrl =
      typeof item?.nt_icon_location === 'string' && item.nt_icon_location.trim().length > 0
        ? item.nt_icon_location.trim()
        : '';
    const directLink = getNotificationLink(item);
    const formattedDate = formatDate(item?.un_created_at);
    const descriptionHtml = convertPlainUrlsToAnchors(item?.nt_description || '');
    const hasImage = Boolean(imageUrl);
    const hasDirectLink = Boolean(directLink);

    return (
      <TouchableOpacity
        activeOpacity={hasDirectLink ? 0.92 : 1}
        style={styles.card}
        onPress={hasDirectLink ? () => openBrowserLink(directLink) : undefined}
      >
        {hasImage ? (
          <Image
            source={{ uri: imageUrl }}
            style={styles.cardImage}
            resizeMode="cover"
          />
        ) : null}

        <View style={styles.cardContent}>
          <Text style={styles.cardTitle}>{item?.nt_title || 'Notification'}</Text>

          {formattedDate ? (
            <Text style={styles.metaText}>Posted on: {formattedDate}</Text>
          ) : null}

          <RenderHtml
            contentWidth={contentWidth}
            source={{ html: descriptionHtml }}
            baseStyle={styles.descriptionBase}
            tagsStyles={{
              p: styles.descriptionParagraph,
              a: styles.linkText,
              strong: styles.descriptionStrong,
              b: styles.descriptionStrong,
              li: styles.descriptionListItem,
              ul: styles.descriptionList,
              ol: styles.descriptionList,
            }}
            renderersProps={{
              a: {
                onPress: (_event, href) => openBrowserLink(href),
              },
            }}
          />

          {hasDirectLink ? (
            <Text style={styles.visitLink}>Tap card to open link</Text>
          ) : null}
        </View>
      </TouchableOpacity>
    );
  };

  const renderEmptyState = () => (
    <View style={styles.emptyCard}>
      <Text style={styles.emptyTitle}>No Notifications Yet</Text>
      <Text style={styles.emptyText}>New updates and announcements will appear here.</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={HEADER_COLOR} barStyle="light-content" />

      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.navigate('Footer')}
          style={styles.backButton}
          activeOpacity={0.85}
        >
          <Icon name="left" size={20} color="#FFFFFF" />
          <Text style={styles.headerText}>Back</Text>
        </TouchableOpacity>
      </View>

      {loader ? (
        <View style={styles.loaderWrapper}>
          <ActivityIndicator size="large" color={HEADER_COLOR} />
        </View>
      ) : (
        <FlatList
          data={list}
          renderItem={renderNotificationCard}
          keyExtractor={(item, index) =>
            String(item?.id || item?.nt_id || item?.un_id || index)
          }
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={renderEmptyState}
        />
      )}
    </SafeAreaView>
  );
};

export default MyNotifications;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F1F1',
  },
  header: {
    backgroundColor: HEADER_COLOR,
    height: hp(8),
    paddingHorizontal: wp(4),
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerText: {
    color: '#FFFFFF',
    fontSize: hp(2),
    fontWeight: '500',
    marginLeft: wp(2),
  },
  loaderWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  listContent: {
    paddingHorizontal: wp(4),
    paddingTop: hp(1.8),
    paddingBottom: hp(12),
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: hp(2),
    marginBottom: hp(2),
    overflow: 'hidden',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  cardImage: {
    width: '100%',
    height: hp(33),
    backgroundColor: '#F5F5F5',
  },
  cardContent: {
    paddingHorizontal: wp(4),
    paddingTop: hp(1.8),
    paddingBottom: hp(2.2),
  },
  cardTitle: {
    fontSize: hp(2.05),
    color: HEADER_COLOR,
    fontWeight: '700',
    marginBottom: hp(0.8),
  },
  metaText: {
    fontSize: hp(1.55),
    color: '#8C6F6F',
    marginBottom: hp(1.2),
  },
  descriptionBase: {
    color: '#3E3333',
    fontSize: hp(1.72),
    lineHeight: hp(2.55),
  },
  descriptionParagraph: {
    marginTop: 0,
    marginBottom: hp(0.9),
    color: '#3E3333',
  },
  descriptionStrong: {
    fontWeight: '700',
    color: '#2B2323',
  },
  descriptionList: {
    marginTop: 0,
    marginBottom: hp(0.8),
    paddingLeft: wp(4),
  },
  descriptionListItem: {
    color: '#3E3333',
    marginBottom: hp(0.4),
  },
  linkText: {
    color: '#B5232E',
    textDecorationLine: 'underline',
  },
  visitLink: {
    marginTop: hp(0.8),
    color: '#B5232E',
    fontSize: hp(1.5),
    fontWeight: '600',
  },
  emptyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: hp(2),
    paddingVertical: hp(4),
    paddingHorizontal: wp(6),
    alignItems: 'center',
    marginTop: hp(3),
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  emptyTitle: {
    fontSize: hp(2.2),
    fontWeight: '700',
    color: HEADER_COLOR,
  },
  emptyText: {
    marginTop: hp(1),
    fontSize: hp(1.75),
    color: '#6A5C5C',
    textAlign: 'center',
    lineHeight: hp(2.4),
  },
});
