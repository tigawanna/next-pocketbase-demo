export interface GithubOauthResponse {
    meta: OauthMetaResponse
    record: PBUserRecord
    token: string
}

export interface OauthMetaResponse {
    id: string
    name: string
    username: string
    email: string
    avatarUrl: string
    rawUser: RawUser
    accessToken: string
    refreshToken: string
}

export interface RawUser {
    avatar_url: string
    bio: string
    blog: string
    collaborators: number
    company: any
    created_at: string
    disk_usage: number
    email: string
    events_url: string
    followers: number
    followers_url: string
    following: number
    following_url: string
    gists_url: string
    gravatar_id: string
    hireable: any
    html_url: string
    id: number
    location: string
    login: string
    name: string
    node_id: string
    organizations_url: string
    owned_private_repos: number
    plan: Plan
    private_gists: number
    public_gists: number
    public_repos: number
    received_events_url: string
    repos_url: string
    site_admin: boolean
    starred_url: string
    subscriptions_url: string
    total_private_repos: number
    twitter_username: any
    two_factor_authentication: boolean
    type: string
    updated_at: string
    url: string
}

export interface Plan {
    collaborators: number
    name: string
    private_repos: number
    space: number
}

export interface PBUserRecord {
    access_token: string
    avatar: string
    bio: string
    collectionId: string
    collectionName: string
    created: string
    email: string
    emailVisibility: boolean
    github_login: string
    id: string
    updated: string
    username: string
    verified: boolean
    expand: PBUserRecordExpand;
}

export interface PBUserRecordExpand { }


export type TUserSignUpFormFields =
    Pick<PBUserRecord, "email" | "emailVisibility" | "username" | "avatar" | "github_login"> & {
        password: string;
        confirmPassword: string;
    }
