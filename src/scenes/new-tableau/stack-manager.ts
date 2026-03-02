import { CardAnchor } from "./card-anchor";
import { FlippableActor } from "./flippable-actor";

export class StackManager {
  private anchors: CardAnchor[] = []
  private cards: FlippableActor[] = []

  private startingStack: CardAnchor | undefined
  private startingCard: FlippableActor | undefined
  private temporaryStack: CardAnchor

  constructor(temporaryStack: CardAnchor) {
    this.temporaryStack = temporaryStack
  }

  addStacks(...stacks: CardAnchor[]) {
    stacks.forEach((stack) => {
      stack.on('pointerdown', () => this.onStackDown(stack))
      stack.on('pointerup', () => this.onStackUp(stack))
    })
    this.anchors.push(...stacks)
  }

  addCards(...cards: FlippableActor[]) {
    cards.forEach((card) => {
      card.on('pointerdown', () => this.onCardDown(card))
      card.on('pointerup', () => this.onCardUp(card))
    })
    this.cards.push(...cards)
  }

  cleanup() {
    this.anchors.forEach(anchor => {
      anchor.off('pointerdown')
      anchor.off('pointerup')
    })

    this.cards.forEach((card) => {
      card.off('pointerdown')
      card.off('pointerup')
    })

    this.anchors = []
    this.cards = []
  }

  private onStackDown = (stack: CardAnchor) => {
    if (this.startingStack) {
      return
    }

    this.startingStack = stack
  }

  private onStackUp = (stack: CardAnchor) => {
    const firstCard = this.temporaryStack.getCardAt(0)
    const card = firstCard?.card
    console.log(firstCard, !!card, card && stack.accepts(card))

    if (!firstCard) {
      this.startingCard = undefined
      this.startingStack = undefined
      return
    }

    const cards = this.temporaryStack.detachAll()

    if (card && stack.accepts(card)) {
      stack.attach(...cards)
    } else {
      this.startingStack?.attach(...cards)
    }

    this.startingCard = undefined
    this.startingStack = undefined
  }

  private onCardDown = (card: FlippableActor) => {
    console.log(`Card down - ${card.card?.toString()} - ${card.z}`)
    if (this.startingCard) {
      return
    }

    this.startingCard = card

    if (!this.startingStack) {
      return
    }

    const cards = this.startingStack.detach(card)

    if (cards) {
      this.temporaryStack.attach(...cards)
    }
  }

  private onCardUp = (card: FlippableActor) => {
    console.log('CARD UP!')
    if (!this.startingStack) {
      return
    }

    const cards = this.temporaryStack.detachAll()
    this.startingStack.attach(...cards)

    this.startingCard = undefined
    this.startingStack = undefined
  }
}