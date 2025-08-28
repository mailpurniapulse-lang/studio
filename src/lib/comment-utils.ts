import { db } from './firebase';
import { collection, getDocs } from 'firebase/firestore';

export async function getCommentStats(slug: string) {
  try {
    const commentsRef = collection(db, `content/${slug}/comments`);
    const snapshot = await getDocs(commentsRef);

    let likeCount = 0;
    snapshot.forEach(doc => {
      likeCount += doc.data().likes || 0;
    });

    return {
      commentCount: snapshot.size,
      likeCount,
    };
  } catch (error) {
    console.error(`Error fetching comment stats for ${slug}:`, error);
    return {
      commentCount: 0,
      likeCount: 0,
    };
  }
}
