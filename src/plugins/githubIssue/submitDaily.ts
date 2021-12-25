import { Octokit } from "@octokit/core";
import dayjs from "dayjs";

let OWNER = "";
let REPO = "";

interface Comment {
  id: number;
  user: {
    id: number;
  } | null;
}

interface Context {
  issueNumber: number;
  userInfo: {
    id: number;
  };
  commentList: Array<Comment>;
}

const context: Context = {
  issueNumber: 0,
  userInfo: {
    id: 0,
  },
  commentList: [],
};

interface SubmitDailyInfo {
  content: string;
  githubToken: string;
  owner: string;
  repo: string;
}

export async function submitDaily({
  content,
  githubToken,
  owner,
  repo,
}: SubmitDailyInfo) {
  OWNER = owner;
  REPO = repo;

  const octokit = new Octokit({ auth: githubToken });

  async function initContext() {
    const issueInfo = await getCurrentIssueInfo(currentIssueName());
    if (issueInfo) {
      context.issueNumber = issueInfo.number;
    }

    context.userInfo = await selfUserInfo();

    const commentList = await getCommentList();
    if (commentList) {
      context.commentList = commentList;
    }
  }

  function currentIssueName() {
    function getDate() {
      return dayjs().format("YYYY-MM-DD");
    }

    return `【每日计划】 ${getDate()}`;
  }

  async function getCurrentIssueInfo(issueName: string) {
    const { data } = await octokit.request("GET /repos/{owner}/{repo}/issues", {
      owner: OWNER,
      repo: REPO,
    });

    return data.find((info) => {
      return info.title === issueName;
    });
  }

  async function selfUserInfo() {
    const { data } = await octokit.request("/user");
    return data;
  }

  async function sendDailyContent(content: string) {
    if (!isCommented()) {
      addDailyContent(content);
    } else {
      console.log(context);
      updateDailyContent(content);
    }
  }

  function isCommented() {
    return context.commentList.some(
      ({ user }) => user!.id === context.userInfo.id
    );
  }

  function addDailyContent(content: string) {
    octokit.request(
      "POST /repos/{owner}/{repo}/issues/{issue_number}/comments",
      {
        owner: OWNER,
        repo: REPO,
        issue_number: context.issueNumber,
        body: content,
      }
    );
  }

  function getCommentId() {
    const comment = context.commentList.find(
      ({ user }) => user!.id === context.userInfo.id
    );

    if (comment) {
      return comment.id;
    }
  }

  async function updateDailyContent(content: string) {
    const commentId = getCommentId();

    if (commentId) {
      octokit.request(
        "PATCH /repos/{owner}/{repo}/issues/comments/{comment_id}",
        {
          owner: OWNER,
          repo: REPO,
          comment_id: commentId,
          body: content,
        }
      );
    }
  }

  async function getCommentList() {
    const { data } = await octokit.request(
      "GET /repos/{owner}/{repo}/issues/{issue_number}/comments",
      {
        owner: OWNER,
        repo: REPO,
        issue_number: context.issueNumber,
      }
    );

    return data;
  }

  await initContext();
  sendDailyContent(content);
}
