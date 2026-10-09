// Service stubs — wired to Firestore in later phases

export async function getPricing() {
  return {
    oneHour: 2750,
    twoHours: 5500,
  }
}

export async function getPublishedAnnouncements() {
  return []
}

export async function getApprovedReviews() {
  return []
}
