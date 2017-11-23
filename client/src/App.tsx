import * as React from 'react';
import axios from "axios";
import "./app.css";
import {
  TextField,
  PrimaryButton,
  Label,
  List,
  Spinner,
  SpinnerSize,
  Icon
} from "office-ui-fabric-react";
import { initializeIcons } from '@uifabric/icons';

initializeIcons();

export interface Post {
  _id: string;
  text: string;
  author: string;
  created: Date;
}

export interface State {
  author: string;
  text: string;
  loading: boolean;
  posts: Post[];
}

export default class App extends React.Component<{}, State> {
  constructor(props: {}) {
    super(props);
    this.state = {
      loading: true,
      author: "",
      text: "",
      posts: []
    };

    this.getPosts = this.getPosts.bind(this);
    this.sendPost = this.sendPost.bind(this);
    this.deletePost = this.deletePost.bind(this);

    this.textChanged = this.textChanged.bind(this);
    this.authorChanged = this.authorChanged.bind(this);
    this.onRenderCell = this.onRenderCell.bind(this);
  }

  render() {
    return (
      <div className="main">
        <h1>Chirp</h1>
        <div>
          <TextField placeholder="Your name.." onChanged={this.authorChanged} />
          <TextField placeholder="Your message..." multiline={true} rows={3} onChanged={this.textChanged} />
          <PrimaryButton onClick={this.sendPost} text="Send" />
        </div>

        <div className="posts">
          <Label>Posts</Label>
          {this.state.loading &&
            <Spinner size={SpinnerSize.large} />
          }

          {!this.state.loading &&
            <List items={this.state.posts} onRenderCell={this.onRenderCell} />
          }
        </div>
      </div>
    );
  }

  public componentWillMount() {
    this.getPosts();
  }

  private onRenderCell(item: Post, index: number): JSX.Element {
    return (
      <div className="post">
        <strong>@{item.author}</strong> ({this.dateToString(item.created)})&nbsp;
        <a href="#"><Icon iconName="Delete" onClick={() => { this.deletePost(item._id); }} /></a>
        <br />{item.text}
      </div>
    );
  }

  private authorChanged(value: string): void {
    this.setState({ author: value });
  }

  private textChanged(value: string): void {
    this.setState({ text: value });
  }

  private getPosts(): void {
    axios.get("/api/posts").then(response => {
      this.setState({
        loading: false,
        posts: response.data
      });
    });
  }

  private sendPost(): void {
    axios.post("/api/posts", { author: this.state.author, text: this.state.text }).then(response => {
      this.setState({ text: "" });
      this.getPosts();
    });
  }

  private deletePost(id: string): void {
    axios.delete(`/api/posts/${id}`).then(response => {
      this.getPosts();
    });
  }

  private dateToString(date: Date): string {
    date = new Date(date);
    return `${date.getHours()}:${date.getMinutes()}`;
  }
}
